/* ==================================================
   WAL PAKH - JAMMU & KASHMIR TRAVEL MAP
   Pins are positioned over the illustrated hero map.
   Hover, keyboard focus, and click all reveal a location card.
   ================================================== */

(function exploreMap() {
  const hero = document.querySelector(".hero");
  const mapImg = document.querySelector(".hero-map-img");
  const pinLayer = document.getElementById("mapPins");
  const popup = document.getElementById("mapPopup");
  if (!hero || !pinLayer || !mapImg || !popup) return;

  const FOCAL = { x: 0.5, y: 0.45 };

  const CATEGORY_LABEL = {
    destination: "Signature destination",
    lake: "Lake & nature",
    heritage: "Culture & pilgrimage",
    adventure: "Adventure escape",
  };

  const CATEGORY_ICON = {
    destination: "\u{1F4CD}",
    lake: "\u{1F3D4}\uFE0F",
    heritage: "\u{1F3DB}\uFE0F",
    adventure: "\u{1F9ED}",
  };

  const LOCATION_ICON = {
    gulmarg: "\u{1F6A0}",
    sonamarg: "\u{1F3D4}\uFE0F",
    "dal-lake": "\u{1F6F6}",
    pahalgam: "\u{1F332}",
    muzaffarabad: "\u{1F3DE}\uFE0F",
    "mata-vaishno-devi": "\u{1F6D5}",
    "bahu-fort": "\u{1F3F0}",
    akhnoor: "\u{1F3DB}\uFE0F",
    leh: "\u{1F3EF}",
    "pangong-lake": "\u{1F30A}",
    "hemis-monastery": "\u{1F6D5}",
  };

  const CATEGORY_THEME = {
    destination: { accent: "var(--gold)", light: "var(--gold-light)", tint: "rgba(212,175,55,.32)" },
    lake: { accent: "var(--lake)", light: "var(--lake-light)", tint: "rgba(62,124,140,.38)" },
    heritage: { accent: "var(--heritage)", light: "var(--heritage-light)", tint: "rgba(181,101,29,.36)" },
    adventure: { accent: "var(--airport)", light: "var(--airport-light)", tint: "rgba(108,91,140,.36)" },
  };

  const DEFAULT_THEME = CATEGORY_THEME.destination;

  // Coordinates follow the labelled locations supplied for the current hero map.
  const PLACES = [
    {
      id: "gulmarg", name: "Gulmarg", category: "destination", x: 10.1, y: 20.3,
      best: "Dec-Mar for snow | May-Aug for meadows", image: "assets/images/gulmarg.jpg", desc: "Kashmir's classic mountain resort, known for its sweeping meadows, gondola and ski slopes.",
      highlights: ["Gulmarg Gondola", "Skiing & snow play", "Apharwat views"]
    },
    {
      id: "sonamarg", name: "Sonamarg", category: "destination", x: 39.1, y: 18.1,
      best: "May-Sep", image: "assets/images/sonamarg.jpg", desc: "The Meadow of Gold is a dramatic gateway to glaciers, rivers and high-altitude trails.",
      highlights: ["Thajiwas Glacier", "Pony trails", "Sindh River valley"]
    },
    {
      id: "dal-lake", name: "Dal Lake, Srinagar", category: "lake", x: 14.1, y: 36.7,
      best: "Apr-Oct", image: "assets/images/hotel3.png", desc: "A signature Srinagar setting of houseboats, shikara rides and mountain-framed waters.",
      highlights: ["Shikara rides", "Houseboats", "Lakeside views"]
    },
    {
      id: "pahalgam", name: "Pahalgam", category: "destination", x: 28.2, y: 46.9,
      best: "Mar-May | Jun-Sep", image: "assets/images/pahalgam.jpg", desc: "A beloved hill station in the Lidder Valley and a starting point for many Himalayan journeys.",
      highlights: ["Betaab Valley", "Lidder River", "Aru Valley trail"]
    },
    {
      id: "muzaffarabad", name: "Muzaffarabad", category: "adventure", x: 10.3, y: 61.8,
      best: "Mar-Jun | Sep-Nov", image: "assets/images/hero.png", desc: "A mountain city surrounded by river valleys and forested slopes.",
      highlights: ["River valleys", "Mountain scenery", "Local culture"]
    },
    {
      id: "mata-vaishno-devi", name: "Mata Vaishno Devi", category: "heritage", x: 26.1, y: 74.1,
      best: "Mar-Jun | Sep-Nov", image: "assets/images/honeymoon.png", desc: "A major pilgrimage destination in the foothills of the Trikuta Mountains.",
      highlights: ["Pilgrimage route", "Hillside views", "Katra gateway"]
    },
    {
      id: "bahu-fort", name: "Bahu Fort, Jammu", category: "heritage", x: 39.9, y: 83,
      best: "Oct-Mar", image: "assets/images/hotel2.png", desc: "A historic fort overlooking Jammu's Tawi River landscape.",
      highlights: ["Historic fort", "Tawi views", "Jammu heritage"]
    },
    {
      id: "akhnoor", name: "Akhnoor", category: "heritage", x: 61.1, y: 86,
      best: "Oct-Mar", image: "assets/images/hero.png", desc: "A riverside town in the Jammu region, framed by open landscapes and heritage sites.",
      highlights: ["Riverside scenery", "Heritage sites", "Jammu region"]
    },
    {
      id: "leh", name: "Leh", category: "heritage", x: 71.4, y: 33.6,
      best: "May-Sep", image: "assets/images/sonamarg.jpg", desc: "The high-desert capital of Ladakh, framed by monasteries, mountain passes and clear blue skies.",
      highlights: ["Leh Palace", "Monasteries", "High-altitude culture"]
    },
    {
      id: "pangong-lake", name: "Pangong Lake", category: "lake", x: 75.9, y: 44,
      best: "May-Sep", image: "assets/images/hero-map-real.png", desc: "A striking high-altitude lake whose shades of blue change with the light across the day.",
      highlights: ["Lake viewpoints", "Sunrise colours", "Scenic drive"]
    },
    {
      id: "hemis-monastery", name: "Hemis Monastery", category: "heritage", x: 72.8, y: 58.9,
      best: "May-Sep", image: "assets/images/hero1.png", desc: "A celebrated Buddhist monastery in Ladakh, set among a dramatic mountain landscape.",
      highlights: ["Monastery complex", "Buddhist heritage", "Mountain setting"]
    },
  ];

  const popupImage = document.getElementById("popupImage");
  const popupTag = document.getElementById("popupTag");
  const popupName = document.getElementById("popupName");
  const popupMeta = document.getElementById("popupMeta");
  const popupDesc = document.getElementById("popupDesc");
  const popupHighlights = document.getElementById("popupHighlights");

  let activePin = null;

  function applyTheme(category) {
    const theme = CATEGORY_THEME[category] || DEFAULT_THEME;
    hero.style.setProperty("--hero-accent", theme.accent);
    hero.style.setProperty("--hero-accent-light", theme.light);
    hero.style.setProperty("--hero-tint", theme.tint);
  }

  function resetTheme() {
    hero.style.removeProperty("--hero-accent");
    hero.style.removeProperty("--hero-accent-light");
    hero.style.removeProperty("--hero-tint");
  }

  function render() {
    pinLayer.replaceChildren();

    PLACES.forEach((place) => {
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = `map-pin pin-${place.category}`;
      pin.dataset.id = place.id;
      pin.dataset.x = place.x;
      pin.dataset.y = place.y;
      pin.setAttribute("aria-controls", "mapPopup");
      pin.setAttribute("aria-expanded", "false");
      pin.setAttribute("aria-label", `${place.name}. ${CATEGORY_LABEL[place.category]}.`);
      const icon = LOCATION_ICON[place.id] || CATEGORY_ICON[place.category];
      pin.innerHTML = `<span class="pin-label">${place.name}</span><span class="pin-marker"><span>${icon}</span></span>`;

      pin.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "touch") openPopup(place, pin);
      });
      pin.addEventListener("pointerleave", (event) => {
        if (event.pointerType !== "touch") closePopup(pin);
      });
      pin.addEventListener("focus", () => openPopup(place, pin));
      pin.addEventListener("blur", () => closePopup(pin));
      pin.addEventListener("click", (event) => {
        event.stopPropagation();
        openPopup(place, pin);
      });
      pinLayer.appendChild(pin);
    });

    positionPins();
  }

  function positionPins() {
    const heroRect = hero.getBoundingClientRect();
    const imageRect = mapImg.getBoundingClientRect();
    const containerW = imageRect.width;
    const containerH = imageRect.height;
    const { naturalWidth: naturalW, naturalHeight: naturalH } = mapImg;
    if (!containerW || !containerH || !naturalW || !naturalH) return;

    const imageFit = window.getComputedStyle(mapImg).objectFit;
    const scale = imageFit === "contain"
      ? Math.min(containerW / naturalW, containerH / naturalH)
      : Math.max(containerW / naturalW, containerH / naturalH);
    const renderedW = naturalW * scale;
    const renderedH = naturalH * scale;
    const offsetX = imageRect.left - heroRect.left + (containerW - renderedW) * FOCAL.x;
    const offsetY = imageRect.top - heroRect.top + (containerH - renderedH) * FOCAL.y;

    pinLayer.querySelectorAll(".map-pin").forEach((pin) => {
      pin.style.left = `${offsetX + (Number(pin.dataset.x) / 100) * renderedW}px`;
      pin.style.top = `${offsetY + (Number(pin.dataset.y) / 100) * renderedH}px`;
    });
  }

  function positionPopup(pin) {
    const heroRect = hero.getBoundingClientRect();
    const pinRect = pin.getBoundingClientRect();
    const cardWidth = popup.offsetWidth;
    const cardHeight = popup.offsetHeight;
    const padding = 14;
    const gap = 18;
    const pinTop = pinRect.top - heroRect.top;
    const pinBottom = pinRect.bottom - heroRect.top;
    const pinCenter = pinRect.left - heroRect.left + pinRect.width / 2;

    const left = Math.max(
      padding + cardWidth / 2,
      Math.min(hero.clientWidth - padding - cardWidth / 2, pinCenter)
    );
    const roomAbove = pinTop - gap - padding;
    const roomBelow = hero.clientHeight - pinBottom - gap - padding;
    const showBelow = roomBelow >= cardHeight || roomBelow > roomAbove;
    const top = showBelow
      ? Math.min(pinBottom, hero.clientHeight - padding - cardHeight - gap)
      : Math.max(pinTop, padding + cardHeight + gap);

    popup.style.setProperty("--popup-left", `${left}px`);
    popup.style.setProperty("--popup-top", `${top}px`);
    popup.classList.toggle("popup-below", showBelow);
  }

  function openPopup(place, pin) {
    if (activePin && activePin !== pin) activePin.setAttribute("aria-expanded", "false");
    activePin = pin;
    pin.setAttribute("aria-expanded", "true");
    applyTheme(place.category);

    if (place.image) {
      popupImage.src = place.image;
      popupImage.alt = place.name;
      popupImage.hidden = false;
    } else {
      popupImage.hidden = true;
      popupImage.removeAttribute("src");
    }
    popup.classList.toggle("has-image", Boolean(place.image));

    popupTag.textContent = CATEGORY_LABEL[place.category];
    popupName.textContent = place.name;
    popupMeta.textContent = `Best time: ${place.best}`;
    popupDesc.textContent = place.desc;
    popupHighlights.replaceChildren(...place.highlights.map((highlight) => {
      const item = document.createElement("li");
      item.textContent = highlight;
      return item;
    }));

    popup.classList.add("active");
    positionPopup(pin);
  }

  function closePopup(pin) {
    if (pin && activePin !== pin) return;
    popup.classList.remove("active");
    if (activePin) activePin.setAttribute("aria-expanded", "false");
    activePin = null;
    resetTheme();
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      positionPins();
      if (activePin) positionPopup(activePin);
    }, 120);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePopup();
  });

  render();
  if (mapImg.complete && mapImg.naturalWidth) positionPins();
  else mapImg.addEventListener("load", positionPins, { once: true });
})();
