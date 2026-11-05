/* site.js: nav, reveal-on-scroll, counters, rotator.
   No dependencies. */
(function () {
	'use strict';

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ---- nav: solid background after scroll, active section link ---- */
	var nav = document.getElementById('nav');
	var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
	var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);

	function onScroll() {
		nav.classList.toggle('is-scrolled', window.scrollY > 8);
		// probe a point a third of the way down the viewport, so a section
		// counts as current once it fills the upper part of the screen
		var y = window.scrollY + Math.min(window.innerHeight * 0.35, 260);
		var current = null;
		for (var i = 0; i < sections.length; i++) {
			if (sections[i].offsetTop <= y) current = sections[i].id;
		}
		// at the very bottom the last section may never reach the probe line
		var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
		if (atBottom && sections.length) current = sections[sections.length - 1].id;
		navLinks.forEach(function (a) {
			a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
		});
	}
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	/* ---- brand link: back to top without adding a hash to the URL ----
	   Only when the brand points at the page you are already on. On cv.html it
	   links back to the portfolio, and must be left alone to navigate. */
	var brand = document.querySelector('.brand');
	if (brand && brand.href.split('#')[0] === location.href.split('#')[0]) {
		brand.addEventListener('click', function (e) {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
			if (location.hash) history.replaceState(null, '', location.pathname + location.search);
		});
	}
	if (location.hash === '#top') history.replaceState(null, '', location.pathname + location.search);

	/* ---- theme toggle ---- */
	var themeBtn = document.querySelector('.theme-toggle');
	var mqLight = window.matchMedia('(prefers-color-scheme: light)');
	function currentTheme() {
		var t = document.documentElement.getAttribute('data-theme');
		if (t === 'light' || t === 'dark') return t;
		return mqLight.matches ? 'light' : 'dark';
	}
	function applyTheme(t) {
		document.documentElement.setAttribute('data-theme', t);
		try { localStorage.setItem('theme', t); } catch (e) {}
		var meta = document.querySelector('meta[name="theme-color"]:not([media])');
		if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
		meta.content = t === 'light' ? '#f6f5f1' : '#0b0c10';
		if (themeBtn) themeBtn.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
	}
	if (themeBtn) {
		themeBtn.setAttribute('aria-label', currentTheme() === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
		themeBtn.addEventListener('click', function () { applyTheme(currentTheme() === 'light' ? 'dark' : 'light'); });
	}

	/* ---- mobile menu ---- */
	var toggle = document.querySelector('.nav-toggle');
	var menu = document.getElementById('mobile-menu');
	function setMenu(open) {
		menu.classList.toggle('is-open', open);
		// keep the page underneath still while the menu covers it
		document.documentElement.style.overflow = open ? 'hidden' : '';
		toggle.setAttribute('aria-expanded', String(open));
		toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
	}
	toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
	menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
	document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

	/* ---- reveal on scroll ---- */
	var revealEls = document.querySelectorAll('.reveal, .card, .bento');
	if ('IntersectionObserver' in window && !reduceMotion) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					io.unobserve(entry.target);
				}
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
		revealEls.forEach(function (el) { io.observe(el); });
	} else {
		revealEls.forEach(function (el) { el.classList.add('is-visible'); });
	}

	/* ---- counters ---- */
	var counters = document.querySelectorAll('[data-count]');
	function animateCount(el) {
		var target = parseInt(el.getAttribute('data-count'), 10);
		if (reduceMotion || !isFinite(target)) { el.textContent = target.toLocaleString('en-US'); return; }
		var start = null, dur = 1400;
		function step(ts) {
			if (!start) start = ts;
			var p = Math.min(1, (ts - start) / dur);
			var eased = 1 - Math.pow(1 - p, 3);
			el.textContent = Math.round(target * eased).toLocaleString('en-US');
			if (p < 1) requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	}
	if ('IntersectionObserver' in window) {
		var cio = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
			});
		}, { threshold: 0.5 });
		counters.forEach(function (el) { cio.observe(el); });
	}

	/* ---- rotating phrase in the hero ----
	   Decorative: screen readers get the static sentence beside it instead.
	   It types through every phrase once and comes to rest on the first, and
	   the pause button stops it at any point (WCAG 2.2.2). Under reduced
	   motion it never starts. */
	var rotator = document.querySelector('.rotator');
	var word = rotator && rotator.querySelector('.word');
	var pauseBtn = rotator && rotator.querySelector('.rotator-toggle');
	if (word && !reduceMotion) {
		var phrases = [];
		try { phrases = JSON.parse(word.getAttribute('data-rotate')) || []; } catch (e) { phrases = []; }
		if (phrases.length > 1) {
			var idx = 0, txt = phrases[0], deleting = true, paused = false, timer = null, done = false;
			function finish() {
				done = true;
				clearTimeout(timer);
				word.textContent = phrases[0];
				rotator.classList.add('is-done');
				if (pauseBtn) pauseBtn.hidden = true;
			}
			function tick() {
				if (paused || done) return;
				var full = phrases[idx];
				txt = deleting ? full.slice(0, txt.length - 1) : full.slice(0, txt.length + 1);
				word.textContent = txt;
				var delay = deleting ? 35 : 55;
				if (!deleting && txt === full) {
					if (idx === 0) { finish(); return; }   // back to the first phrase: one full cycle done
					delay = 2200; deleting = true;
				} else if (deleting && txt === '') {
					deleting = false; idx = (idx + 1) % phrases.length; delay = 400;
				}
				timer = setTimeout(tick, delay);
			}
			if (pauseBtn) {
				pauseBtn.hidden = false;
				pauseBtn.addEventListener('click', function () {
					paused = !paused;
					pauseBtn.setAttribute('aria-pressed', String(paused));
					pauseBtn.setAttribute('aria-label', paused ? 'Resume the typing animation' : 'Pause the typing animation');
					rotator.classList.toggle('is-paused', paused);
					if (!paused) timer = setTimeout(tick, 300);
					else clearTimeout(timer);
				});
			}
			timer = setTimeout(tick, 2200);
		}
	} else if (rotator) {
		rotator.classList.add('is-done');
	}
})();
