(() => {
    if (!document.body.classList.contains('adventure-page')) return;

    const adventureSection = document.querySelector('.adventure-itineraries');
    if (!adventureSection || document.getElementById('offbeat-expeditions')) return;

    document.title = 'Adventure & Offbeat Collection | Walpakh';
    const heroTitle = document.querySelector('.adventure-hero h1');
    if (heroTitle) heroTitle.innerHTML = 'Adventure, Camping & <span>Offbeat Collection</span>';

    const offbeatPlans = [
        ['OB01', 'Gurez & Tulail Wilderness', '7 Days / 6 Nights', 'Srinagar · Razdan · Gurez · Dawar · Tulail', 'assets/images/experiences/gurez-sunrise.png', 'A high-valley journey through Gurez and Tulail'],
        ['OB02', 'Warwan Valley Expedition', '7 Days / 6 Nights', 'Srinagar · Daksum · Sinthan · Warwan Villages', 'assets/images/camping.png', 'Village camps and the wild Warwan valley'],
        ['OB03', 'Bangus Valley Expedition', '6 Days / 5 Nights', 'Srinagar · Kupwara · Bangus Valley', 'assets/images/pahalgam.jpg', 'Flower-filled meadows far beyond the usual route'],
        ['OB04', 'Lolab Valley Hidden Kashmir', '6 Days / 5 Nights', 'Srinagar · Lolab · Forest Villages · Meadows', 'assets/images/package-economy.jpg', 'Quiet homestays, forest walks and village life'],
        ['OB05', 'Keran Border Valley', '5 Days / 4 Nights', 'Srinagar · Kupwara · Keran', 'assets/images/gulmarg.jpg', 'A slow river-valley escape on Kashmir’s northern edge'],
        ['OB06', 'Machil Valley Adventure', '6 Days / 5 Nights', 'Kupwara · Machil · Village Trails', 'assets/images/camping.png', 'Remote mountain roads and local village trails'],
        ['OB07', 'Daksum – Kishtwar Trail', '7 Days / 6 Nights', 'Daksum · Sinthan · High-Altitude Trails', 'assets/images/trekking.png', 'A scenic crossing for dedicated trail lovers'],
        ['OB08', 'Aharbal – Kausarnag Trek', '7 Days / 5 Nights', 'Aharbal · Alpine Trails · Kausarnag', 'assets/images/river-rafting.png', 'Waterfalls, alpine lakes and an unforgettable trek'],
        ['OB09', 'Tarsar – Marsar Trek', '6 Days / 5 Nights', 'Aru · Alpine Lakes · Tarsar · Marsar', 'assets/images/sonamarg.jpg', 'Classic Kashmir lake trekking with camp nights'],
        ['OB10', 'Kashmir Great Lakes Lite', '7 Days / 6 Nights', 'Selected Lakes · Alpine Meadows', 'assets/images/sonamarg.jpg', 'A gentler way to experience Kashmir’s high lakes'],
        ['OB11', 'Doodhpathri – Tosamaidan', '6 Days / 5 Nights', 'Doodhpathri · Tosamaidan Meadows', 'assets/images/trekking.png', 'Meadows, hidden trails and wide-open camping'],
        ['OB12', 'Lolab – Bangus Traverse', '7 Days / 6 Nights', 'Lolab · Forests · Villages · Bangus', 'assets/images/pahalgam.jpg', 'A deep dive into North Kashmir’s quiet valleys'],
        ['OB13', 'Gurez – Tulail Trekking Circuit', '8 Days / 7 Nights', 'Gurez · Dawar · Tulail Villages', 'assets/images/experiences/gurez-sunrise.png', 'Village culture and long Himalayan river walks'],
        ['OB14', 'Remote Villages of Kashmir', '8 Days / 7 Nights', 'Lolab · Keran · Machil · Kupwara', 'assets/images/package-economy.jpg', 'Unhurried homestays with local stories'],
        ['OB15', 'Kokernag – Daksum Nature Trail', '5 Days / 4 Nights', 'Kokernag · Daksum · Forest Trails', 'assets/images/river-rafting.png', 'Springs, forests and easy-going nature days'],
        ['OB16', 'Margan Top – Warwan Adventure', '7 Days / 6 Nights', 'Daksum · Sinthan · Margan Top · Warwan', 'assets/images/gulmarg.jpg', 'High passes, remote meadows and campfire evenings'],
        ['OB17', 'Sinthan – Daksum Trek & Camp', '6 Days / 5 Nights', 'Sinthan · Daksum · Mountain Trails', 'assets/images/camping.png', 'A focused trekking escape with wilderness camps'],
        ['OB18', 'Gurez – Razdan – Bandipora', '6 Days / 5 Nights', 'Razdan Pass · Gurez · Dawar · Bandipora', 'assets/images/experiences/gurez-sunrise.png', 'A road-and-trail adventure through North Kashmir'],
        ['OB19', 'Ultimate Unexplored Kashmir', '10 Days / 9 Nights', 'Doodhpathri · Daksum · Warwan · Gurez · Tulail', 'assets/images/sonamarg.jpg', 'A complete route through Kashmir’s wild side'],
        ['OB20', 'Grand Offbeat Kashmir Expedition', '13 Days / 12 Nights', 'Doodhpathri · Tosamaidan · Warwan · Gurez · Tulail', 'assets/images/mapp.png', 'The signature journey for true offbeat explorers']
    ];

    const section = document.createElement('section');
    section.className = 'section adventure-offbeat';
    section.id = 'offbeat-expeditions';
    section.innerHTML = `<div class="container"><div class="section-heading"><p class="kicker"><i class="fa-solid fa-compass"></i> Offbeat Expeditions</p><h2>Remote Kashmir, Real Discovery</h2><p class="section-subtitle">The offbeat collection now lives alongside our adventure journeys: hidden valleys, village stays, high trails and routes made for travellers who prefer the road less taken.</p></div><div class="collection-plan-grid adventure-offbeat__grid"></div></div>`;

    const grid = section.querySelector('.adventure-offbeat__grid');
    grid.innerHTML = offbeatPlans.map(([code, title, duration, route, image, twist]) => `<article class="collection-card collection-card--offbeat" data-package-card><div class="collection-card__media"><img src="${image}" alt="${title}" loading="lazy"><span class="collection-card__number">${code}</span><span class="collection-card__duration">${duration}</span></div><div class="collection-card__content"><p class="collection-card__eyebrow">Remote routes and real Kashmir</p><h3>${title}</h3><p class="collection-card__dest"><i class="fa-solid fa-location-dot"></i> ${route}</p><div class="collection-card__twist"><i class="fa-solid fa-mountain"></i><div><strong>Walpakh Twist</strong><span>${twist}</span></div></div><div class="collection-card__amenities"><span><i class="fa-solid fa-campground"></i>Homestay & Camps</span><span><i class="fa-solid fa-bowl-food"></i>Flexible Meals</span><span><i class="fa-solid fa-car-side"></i>4×4 Transport</span><span><i class="fa-solid fa-person-hiking"></i>Local Guide</span></div><button class="collection-itinerary-toggle" type="button" aria-expanded="false"><span>View day-wise itinerary</span><i class="fa-solid fa-chevron-down"></i></button><ol class="collection-itinerary"><li>Arrive in Srinagar and begin the selected scenic route</li><li>Explore ${title} with a local guide</li><li>Return through Kashmir’s mountain landscapes</li></ol></div></article>`).join('');

    grid.querySelectorAll('.collection-itinerary-toggle').forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.collection-card');
            const expanded = card.classList.toggle('is-itinerary-open');
            button.setAttribute('aria-expanded', String(expanded));
            button.querySelector('span').textContent = expanded ? 'Hide day-wise itinerary' : 'View day-wise itinerary';
        });
    });

    adventureSection.insertAdjacentElement('afterend', section);
})();
