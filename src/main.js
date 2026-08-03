import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initI18n } from './i18n.js'
import { createElement, Pause, Play } from 'lucide'

gsap.registerPlugin(ScrollTrigger)
initI18n()

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const saveData = navigator.connection?.saveData === true
const lowPower = saveData || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || (navigator.deviceMemory && navigator.deviceMemory <= 2)
document.documentElement.classList.toggle('low-power', lowPower)
document.documentElement.classList.toggle('reduced-motion', reducedMotion)

if (!reducedMotion) {
  gsap.from('.hero h1 span, .hero .intro, .hero-offer, .hero-proof', {
    y: 20,
    opacity: 0,
    duration: .65,
    stagger: .07,
    ease: 'power3.out',
    delay: .12
  })

  gsap.utils.toArray('.reveal-section').forEach(section => {
    gsap.from(section.children, {
      opacity: 0,
      y: lowPower ? 10 : 24,
      stagger: lowPower ? .02 : .04,
      duration: lowPower ? .4 : .7,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 88%', once: true }
    })
  })
}

const logoTrack = document.querySelector('.logo-track')
const logoToggle = document.querySelector('.logo-motion-toggle')
const logoViewport = document.querySelector('.logo-viewport')
if (logoTrack && logoToggle && logoViewport) {
  const originals = [...logoTrack.children]
  originals.forEach(item => {
    const clone = item.cloneNode(true)
    clone.setAttribute('aria-hidden', 'true')
    clone.querySelectorAll('a, button').forEach(control => control.setAttribute('tabindex', '-1'))
    if (clone.matches('a')) clone.setAttribute('tabindex', '-1')
    logoTrack.append(clone)
  })

  const setPaused = paused => {
    if (paused) {
      const transform = getComputedStyle(logoTrack).transform
      const offset = transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41
      logoTrack.style.animation = 'none'
      logoTrack.style.transform = 'none'
      logoViewport.classList.add('is-manual')
      requestAnimationFrame(() => { logoViewport.scrollLeft = Math.max(0, -offset) })
    } else {
      const loopWidth = logoTrack.scrollWidth / 2
      const progress = loopWidth ? (logoViewport.scrollLeft % loopWidth) / loopWidth : 0
      logoViewport.classList.remove('is-manual')
      logoViewport.scrollLeft = 0
      logoTrack.style.transform = ''
      logoTrack.style.animation = ''
      logoTrack.style.animationDelay = `${-progress * 56}s`
    }
    logoTrack.classList.toggle('is-paused', paused)
    logoToggle.setAttribute('aria-pressed', String(paused))
    logoToggle.setAttribute('aria-label', paused ? 'Resume company logos' : 'Pause company logos')
    logoToggle.replaceChildren(createElement(paused ? Play : Pause, {
      width: 17,
      height: 17,
      'stroke-width': 1.8,
      'aria-hidden': 'true'
    }))
  }

  setPaused(reducedMotion)
  logoToggle.addEventListener('click', () => setPaused(logoToggle.getAttribute('aria-pressed') !== 'true'))
  logoViewport.addEventListener('wheel', event => {
    if (!logoViewport.classList.contains('is-manual')) return
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
    if (!delta) return
    event.preventDefault()
    logoViewport.scrollLeft += delta
  }, { passive: false })
}

document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'))
  if (!target) return
  event.preventDefault()
  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
}))
