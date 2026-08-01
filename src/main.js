import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initI18n, t } from './i18n.js'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)
initI18n()

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const touchPrimary = matchMedia('(hover: none) and (pointer: coarse)').matches
const saveData = navigator.connection?.saveData === true
const lowPower = saveData || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || (navigator.deviceMemory && navigator.deviceMemory <= 2)
document.documentElement.classList.toggle('low-power', lowPower)
document.documentElement.classList.toggle('reduced-motion', reducedMotion)

const hero = document.querySelector('.hero')
const techRail = document.querySelector('.tech-rail')
if (hero && techRail) hero.after(techRail)

if (!reducedMotion) {
  gsap.from('.hero h1 span', { yPercent: lowPower ? 32 : 110, opacity: 0, duration: lowPower ? .65 : 1.25, stagger: .06, ease: 'expo.out', delay: lowPower ? .15 : .72 })
  gsap.from('.hero-art', lowPower ? { opacity: 0, duration: .6, delay: .12 } : { clipPath: 'inset(100% 0 0 0)', duration: 1.25, ease: 'expo.inOut', delay: .32 })
  gsap.utils.toArray('.reveal-section').forEach(section => gsap.from(section.children, { opacity: 0, y: lowPower ? 10 : 28, stagger: lowPower ? .02 : .045, duration: lowPower ? .45 : .85, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 88%', once: true } }))
}

const cards = [
  { company: 'NEBIUS', role: 'AI CLOUD', metric: 'AI', highlight: 'CLOUD INFRASTRUCTURE', color: '#D7F54D', target: '#experience' },
  { company: 'INTBIS', role: 'FRONTEND LEAD', metric: '10+', highlight: 'ACTIVE / SHIPPED PROJECTS', color: '#AD343E', target: '#experience' },
  { company: 'PLUXBOX', role: 'FULL-STACK', metric: '60%', highlight: 'STORYBOOK COMPONENTS', color: '#08A0E8', target: '#experience' },
  { company: 'DOCSCOUT', role: 'UI/UX + REACT', metric: '100%', highlight: 'UI DESIGNED FROM ZERO', color: '#031B5F', target: '#experience' },
  { company: 'POKRUGU', role: 'FOUNDER', metric: '0→1', highlight: 'MARKETPLACE SHIPPED', color: '#AD343E', target: '#experience' },
  { company: 'KICKSHARING', role: 'FRONTEND', metric: 'WEB', highlight: 'FULL WEBSITE LIVE', color: '#11AF3C', target: '#work' },
  { company: 'BANCA', role: 'PRODUCTION WEB', metric: 'LIVE', highlight: 'PUBLIC PRODUCT', color: '#0556F5', target: '#work' },
  { company: 'ITS-TECH', role: 'UI/UX + FRONTEND', metric: 'LAB', highlight: 'STUDENT TECH SYSTEMS', color: '#E0E0CE', target: '#experience' },
  { company: 'STEN TRAVEL', role: 'TOURISM WEBSITE', metric: 'DISCOVER', highlight: 'WEBSITE PREVIEW', color: '#FDD109', target: '#work' }
]

const canvas = document.querySelector('#experience-spiral')
const host = document.querySelector('.hero-art')
let renderer
try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !lowPower, powerPreference: lowPower ? 'low-power' : 'high-performance', precision: lowPower ? 'mediump' : 'highp' })
} catch {
  host.classList.add('webgl-fallback')
}

if (renderer) {
renderer.setPixelRatio(Math.min(devicePixelRatio, lowPower ? 1.25 : touchPrimary ? 1.4 : 1.75))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setClearColor(0x000000, 0)
const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x000000, .092)
const camera = new THREE.PerspectiveCamera(43, 1, .1, 30)
camera.position.set(0, .1, 11.8)
const orbit = new THREE.Group()
orbit.rotation.x = -.08
scene.add(orbit)

function cardTexture(card, index) {
  const surface = document.createElement('canvas')
  const textureWidth = lowPower ? 768 : 1024
  surface.width = textureWidth
  surface.height = Math.round(textureWidth * 600 / 1024)
  const ctx = surface.getContext('2d')
  ctx.scale(surface.width / 1024, surface.height / 600)
  ctx.fillStyle = index % 3 === 2 ? '#E0E0CE' : '#191919'
  ctx.fillRect(0, 0, surface.width, surface.height)
  ctx.fillStyle = card.color
  ctx.fillRect(0, 0, 24, surface.height)
  ctx.strokeStyle = index % 3 === 2 ? 'rgba(0,0,0,.16)' : 'rgba(224,224,206,.14)'
  ctx.lineWidth = 2
  for (let x = 0; x < surface.width; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, surface.height); ctx.stroke() }
  for (let y = 0; y < surface.height; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(surface.width, y); ctx.stroke() }
  const lightCard = index % 3 === 2
  const ink = lightCard ? '#000000' : '#E0E0CE'
  ctx.fillStyle = ink
  ctx.font = '24px monospace'
  ctx.fillText(`0${index % cards.length + 1} / ${t('EXPERIENCE')}`, 66, 68)
  ctx.textAlign = 'right'
  ctx.fillText(`${t('OPEN')} ↗`, 945, 68)
  ctx.textAlign = 'left'
  ctx.font = '600 96px Syne, sans-serif'
  ctx.fillText(card.company, 62, 275)
  ctx.font = '28px monospace'
  ctx.fillText(card.role, 68, 342)
  const highlightColor = card.color
  const highlightInk = ['#AD343E', '#0556F5', '#08A0E8', '#031B5F', '#8F0E13'].includes(highlightColor) ? '#E0E0CE' : '#000000'
  ctx.fillStyle = highlightColor
  ctx.fillRect(48, 452, 928, 112)
  ctx.fillStyle = highlightInk
  ctx.font = '600 64px Syne, sans-serif'
  ctx.fillText(card.metric, 68, 535)
  const metricWidth = ctx.measureText(card.metric).width
  const detailX = Math.max(260, 68 + metricWidth + 48)
  ctx.font = '20px monospace'
  ctx.fillText(t(card.highlight), detailX, 524)
  const texture = new THREE.CanvasTexture(surface)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return texture
}

const radius = 7.3
const meshes = []
const orbitCardCount = cards.length * 2
let textures = cards.map((card, index) => cardTexture(card, index))
cards.concat(cards).forEach((card, index) => {
  const cardIndex = index % cards.length
  const angle = index / orbitCardCount * Math.PI * 2
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.48, 1.46),
    new THREE.MeshBasicMaterial({ map: textures[cardIndex], side: THREE.DoubleSide })
  )
  mesh.position.set(Math.sin(angle) * radius, ((index % 4) - 1.5) * .22, Math.cos(angle) * radius)
  mesh.rotation.y = angle
  mesh.rotation.z = (index % 2 ? 1 : -1) * .025
  mesh.userData.target = card.target
  mesh.userData.card = card
  mesh.userData.cardIndex = cardIndex
  orbit.add(mesh)
  meshes.push(mesh)
})

let pointerX = 0, pointerY = 0, targetRotation = 0, velocity = 0, dragging = false, touchTracking = false, suppressClick = false, dragX = 0, dragY = 0
function setPointer(event) {
  const rect = host.getBoundingClientRect()
  pointerX = ((event.clientX - rect.left) / rect.width - .5) * 2
  pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2
}
host.addEventListener('pointermove', event => {
  setPointer(event)
  if (touchTracking) {
    const deltaX = event.clientX - dragX
    const deltaY = event.clientY - dragY
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      velocity += deltaX * .0007
      suppressClick = suppressClick || Math.abs(deltaX) > 5
    }
    dragX = event.clientX
    dragY = event.clientY
    return
  }
  if (dragging) { const delta = event.clientX - dragX; velocity += delta * .0009; dragX = event.clientX }
})
host.addEventListener('pointerdown', event => {
  dragX = event.clientX
  dragY = event.clientY
  if (event.pointerType === 'touch') { touchTracking = true; suppressClick = false; return }
  dragging = true
  host.setPointerCapture(event.pointerId)
})
host.addEventListener('pointerup', event => {
  if (event.pointerType === 'touch') { touchTracking = false; return }
  if (!dragging) return
  dragging = false
  if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId)
})
host.addEventListener('pointercancel', () => { dragging = false; touchTracking = false })
host.addEventListener('pointerleave', () => { if (!dragging) { pointerX = 0; pointerY = 0 } })

const raycaster = new THREE.Raycaster()
const clickPoint = new THREE.Vector2()
host.addEventListener('click', event => {
  if (suppressClick) { suppressClick = false; return }
  if (Math.abs(velocity) > .018) return
  const rect = canvas.getBoundingClientRect()
  clickPoint.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height * 2 - 1))
  raycaster.setFromCamera(clickPoint, camera)
  const hit = raycaster.intersectObjects(meshes)[0]
  if (hit) document.querySelector(hit.object.userData.target)?.scrollIntoView({ behavior: 'smooth' })
})

function resizeThree() {
  const rect = host.getBoundingClientRect()
  renderer.setSize(rect.width, rect.height, false)
  camera.aspect = rect.width / rect.height
  const narrowSceneOffset = Math.max(0, 1.2 - camera.aspect) * 3.6
  const tabletOffset = innerWidth > 720 && innerWidth <= 1366 ? .55 : 0
  camera.position.z = 11.8 + Math.min(narrowSceneOffset, 1.65) + tabletOffset
  camera.updateProjectionMatrix()
}
new ResizeObserver(resizeThree).observe(host)

let lastScroll = scrollY
addEventListener('scroll', () => {
  const delta = scrollY - lastScroll
  if (!touchPrimary) velocity += delta * .00016
  lastScroll = scrollY
}, { passive: true })

let heroVisible = true
let renderActive = false
let animationFrame = 0
let lastRenderAt = 0
function render(time = 0) {
  if (!renderActive) return
  animationFrame = requestAnimationFrame(render)
  if (touchPrimary && time - lastRenderAt < 30) return
  lastRenderAt = time
  velocity *= .93
  targetRotation += (touchPrimary ? .001 : .0014) + velocity
  orbit.rotation.y += (targetRotation - orbit.rotation.y) * .065
  orbit.rotation.x += ((-.08 + pointerY * .09) - orbit.rotation.x) * .045
  orbit.position.x += ((pointerX * -.22) - orbit.position.x) * .045
  camera.position.x += ((pointerX * .25) - camera.position.x) * .035
  camera.lookAt(0, 0, 0)
  renderer.render(scene, camera)
}

function updateRenderState() {
  const shouldRender = heroVisible && !document.hidden
  if (shouldRender && !renderActive) { renderActive = true; animationFrame = requestAnimationFrame(render) }
  else if (!shouldRender && renderActive) { renderActive = false; cancelAnimationFrame(animationFrame) }
}
new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; updateRenderState() }, { rootMargin: '160px 0px' }).observe(host)
document.addEventListener('visibilitychange', updateRenderState)
updateRenderState()

addEventListener('languagechange', () => {
  const oldTextures = textures
  textures = cards.map((card, index) => cardTexture(card, index))
  meshes.forEach(mesh => {
    mesh.material.map = textures[mesh.userData.cardIndex]
    mesh.material.needsUpdate = true
  })
  oldTextures.forEach(texture => texture.dispose())
})
}

document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'))
  if (!target) return
  event.preventDefault()
  const mask = document.querySelector('.transition-mask')
  gsap.timeline().to(mask, { y: 0, duration: .3, ease: 'expo.inOut' }).call(() => target.scrollIntoView()).to(mask, { y: '-100%', duration: .38, ease: 'expo.inOut' }).set(mask, { y: '100%' })
}))
