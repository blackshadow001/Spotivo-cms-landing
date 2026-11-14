const workflowSteps = [
  {
    number: "01 / PREPARE",
    title: "Bring your media in.",
    copy: "Upload campaign images and videos into one asset library. Spotivo prepares supported media for consistent TV playback.",
    list: ["Image and video assets", "Clear media type and duration", "Reusable across playlists"],
    image: "assets/workflow/06-ads-clean.png",
    alt: "Spotivo advertisement library"
  },
  {
    number: "02 / CONNECT",
    title: "Pair the physical screen.",
    copy: "Enter the temporary pairing code shown by the player, then name the display and set its installation direction.",
    list: ["Simple pairing code", "Portrait or landscape setup", "Flip and audio controls"],
    image: "assets/workflow/04-screens-clean.png",
    alt: "Spotivo screens and pairing view"
  },
  {
    number: "03 / DEPLOY",
    title: "Send the right playlist.",
    copy: "Arrange media in playback order and assign the playlist to one screen, a screen group, or an entire location.",
    list: ["Reorder playlist items", "Video plays to completion", "Target the exact audience"],
    image: "assets/workflow/08-assignment-clean.png",
    alt: "Spotivo playlist assignment view"
  },
  {
    number: "04 / OBSERVE",
    title: "Know what is happening.",
    copy: "Use screen status and playback reporting to check that assigned content reached the display and completed playback.",
    list: ["Online and offline status", "Playback activity", "Screen-specific reporting"],
    image: "assets/workflow/10-metrics-clean.png",
    alt: "Spotivo playback metrics view"
  }
];

const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileNav?.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
});

mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuToggle?.setAttribute("aria-expanded", "false");
  mobileNav.classList.remove("open");
  document.body.classList.remove("menu-open");
}));

const header = document.querySelector("[data-header]");
window.addEventListener("scroll", () => header?.classList.toggle("scrolled", window.scrollY > 24), { passive: true });

const tabs = [...document.querySelectorAll("[data-step]")];
const frame = document.querySelector(".browser-frame");
const image = document.querySelector("[data-workflow-image]");
const number = document.querySelector("[data-workflow-number]");
const title = document.querySelector("[data-workflow-title]");
const copy = document.querySelector("[data-workflow-copy]");
const list = document.querySelector("[data-workflow-list]");
const progress = document.querySelector("[data-workflow-progress]");

tabs.forEach((tab) => tab.addEventListener("click", () => {
  const index = Number(tab.dataset.step);
  const step = workflowSteps[index];
  tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
  frame?.classList.add("changing");
  window.setTimeout(() => {
    if (image) { image.src = step.image; image.alt = step.alt; }
    if (number) number.textContent = step.number;
    if (title) title.textContent = step.title;
    if (copy) copy.textContent = step.copy;
    if (list) list.innerHTML = step.list.map((item) => `<li>${item}</li>`).join("");
    if (progress) progress.style.width = `${(index + 1) * 25}%`;
    frame?.classList.remove("changing");
  }, 180);
}));

const pricingSlider = document.querySelector("#screenSlider");
const pricingCount = document.querySelector("#calcScreenCount");
const pricingButtonCount = document.querySelector("#btnScreenCount");
const pricingAmount = document.querySelector("#calcPriceAmount");
const pricingNote = document.querySelector("#calcBillingNote");
const pricingTier = document.querySelector("#calcTierBadge");
const billingButton = document.querySelector("#btnBillingCycle");
const monthlyLabel = document.querySelector("#labelMonthly");
const annualLabel = document.querySelector("#labelAnnual");
let annualBilling = true;

function updatePricingCalculator() {
  if (!pricingSlider) return;
  const count = Number(pricingSlider.value);
  let rate = 499;
  let tier = "Starter Plan";

  if (count >= 50) {
    rate = 299;
    tier = "Enterprise Plan";
  } else if (count >= 6) {
    rate = 399;
    tier = "Business Plan";
  }

  const regularMonthly = count * rate;
  const displayedMonthly = annualBilling ? Math.round(regularMonthly * 0.8) : regularMonthly;
  const annualTotal = displayedMonthly * 12;
  const annualSavings = (regularMonthly - displayedMonthly) * 12;

  if (pricingCount) pricingCount.textContent = String(count);
  if (pricingButtonCount) pricingButtonCount.textContent = String(count);
  if (pricingTier) pricingTier.textContent = tier;
  if (pricingAmount) pricingAmount.textContent = displayedMonthly.toLocaleString("en-IN");
  if (pricingNote) {
    pricingNote.textContent = annualBilling
      ? `Billed annually at ₹${annualTotal.toLocaleString("en-IN")} / yr (Save ₹${annualSavings.toLocaleString("en-IN")})`
      : `Billed monthly. Switch to Annual to save 20% on all ${count} screens.`;
  }
}

pricingSlider?.addEventListener("input", updatePricingCalculator);
billingButton?.addEventListener("click", () => {
  annualBilling = !annualBilling;
  billingButton.classList.toggle("active", annualBilling);
  billingButton.setAttribute("aria-pressed", String(annualBilling));
  annualLabel?.classList.toggle("active", annualBilling);
  monthlyLabel?.classList.toggle("active", !annualBilling);
  updatePricingCalculator();
});
updatePricingCalculator();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
document.querySelector("[data-year]").textContent = new Date().getFullYear();
