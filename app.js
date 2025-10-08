const experienceData = [
  {
    id: 'atelier-savor',
    title: 'Atelier fragrance workshop',
    category: 'art',
    duration: '2 hrs',
    description:
      'Blend a signature scent inside a Saint-Germain perfumery guided by a master nose.',
    addOn: 'Pair with tea at Ladurée Bonaparte afterwards.'
  },
  {
    id: 'canal-picnic',
    title: 'Canal Saint-Martin picnic cruise',
    category: 'cuisine',
    duration: '3 hrs',
    description:
      'Float along the canal with a private chef-curated picnic and live accordion.',
    addOn: 'Best at golden hour with chilled pét-nat.'
  },
  {
    id: 'marais-gallery',
    title: 'Le Marais gallery stroll',
    category: 'art',
    duration: '90 mins',
    description:
      'Meet gallerists showcasing contemporary art tucked away on cobblestoned rues.',
    addOn: 'Request artist studio introductions in advance.'
  },
  {
    id: 'latin-jazz',
    title: 'Left Bank jazz & supper club',
    category: 'nightlife',
    duration: 'Evening',
    description:
      'Slip into a candlelit cellar for an intimate trio performance with a prix fixe menu.',
    addOn: 'Arrive early for a martini at the bar upstairs.'
  },
  {
    id: 'versailles-cycling',
    title: 'Versailles estate cycling',
    category: 'culture',
    duration: 'Day trip',
    description:
      'Pedal through Versailles gardens, picnic on the Grand Canal, and tour the estate with a historian.',
    addOn: 'Upgrade to a sunrise hot-air balloon preview.'
  },
  {
    id: 'market-tasting',
    title: 'Marché d’Aligre tasting trail',
    category: 'cuisine',
    duration: 'Morning',
    description:
      'Sample cheeses, oysters, and patisserie with a local gourmand through bustling stalls.',
    addOn: 'Take notes for your market-inspired dinner.'
  },
  {
    id: 'literary-salon',
    title: 'Literary salon evening',
    category: 'culture',
    duration: '2 hrs',
    description:
      'Join a private reading and conversation in a Belle Époque apartment overlooking the Seine.',
    addOn: 'Dress in cocktail attire for champagne toasts.'
  }
];

const neighborhoods = [
  {
    id: 'montmartre',
    name: 'Montmartre',
    mood: 'Bohemian heights',
    description:
      'Artists at Place du Tertre, vintage cinemas, and sweeping dusk views crowned by Sacré-Cœur.',
    highlight: 'Book a portrait session in a tucked-away atelier.'
  },
  {
    id: 'saint-germain',
    name: 'Saint-Germain-des-Prés',
    mood: 'Intellectual romance',
    description:
      'Iconic cafés, jazz cellars, and antique bookstores where philosophers once scribbled.',
    highlight: 'Order a café crème at Café de Flore before browsing rare editions next door.'
  },
  {
    id: 'canal-north',
    name: 'Canal Saint-Martin',
    mood: 'Creative drift',
    description:
      'Design studios, wine bars, and leafy quays perfect for an afternoon people-watch.',
    highlight: 'Pick up natural wine at La Buvette and settle on the locks for sunset.'
  },
  {
    id: 'le-marais',
    name: 'Le Marais',
    mood: 'Fashioned history',
    description:
      'A tapestry of hôtels particuliers, fashion houses, and falafel joints in medieval lanes.',
    highlight: 'Visit Musée Carnavalet then savor sablés from a 17th-century bakery.'
  }
];

const surpriseItineraries = [
  ['Sunrise espresso at Café Saint-Régis', 'Explore Musée d’Orsay impressionists', 'Picnic on Île de la Cité', 'Evening jazz at Duc des Lombards'],
  ['Pain au chocolat breakfast in Le Marais', 'Atelier fragrance workshop', 'Vintage shopping on Rue des Martyrs', 'Dinner cruise on the Seine'],
  ['Morning run along Canal Saint-Martin', 'Cooking class in Montorgueil', 'Contemporary art tour at Palais de Tokyo', 'Speakeasy cocktails in Pigalle']
];

const experienceGrid = document.querySelector('#experience-grid');
const detailContainer = document.querySelector('#experience-details');
const filterButtons = document.querySelectorAll('.filter-button');
const planForm = document.querySelector('#plan-form');
const itineraryList = document.querySelector('#itinerary-list');
const itineraryEmpty = document.querySelector('#itinerary-empty');
const plannerSummary = document.querySelector('#planner-summary');
const surpriseButton = document.querySelector('#surprise-me');
const yearSpan = document.querySelector('#year');
const neighborhoodGrid = document.querySelector('#neighborhood-grid');

let itineraryItems = [];

const loadItinerary = () => {
  try {
    const stored = localStorage.getItem('paristuan-itinerary');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        itineraryItems = parsed;
      }
    }
  } catch (error) {
    console.warn('Unable to load saved itinerary', error);
  }
};

const saveItinerary = () => {
  try {
    localStorage.setItem('paristuan-itinerary', JSON.stringify(itineraryItems));
  } catch (error) {
    console.warn('Unable to save itinerary', error);
  }
};

const experienceCard = (experience) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="meta">${experience.category}</div>
    <h3>${experience.title}</h3>
    <p>${experience.description}</p>
    <p class="meta">${experience.duration}</p>
    <button class="button ghost" data-action="detail" data-id="${experience.id}">Peek inside</button>
    <button class="button primary" data-action="add" data-title="${experience.title}">Add to itinerary</button>
  `;
  return card;
};

const renderExperiences = (filter = 'all') => {
  experienceGrid.innerHTML = '';
  const filtered =
    filter === 'all'
      ? experienceData
      : experienceData.filter((exp) => exp.category === filter);

  filtered.forEach((experience) => {
    experienceGrid.appendChild(experienceCard(experience));
  });

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No experiences yet in this mood—check back soon!';
    experienceGrid.appendChild(empty);
  }
};

const renderDetail = (experienceId) => {
  const experience = experienceData.find((exp) => exp.id === experienceId);
  detailContainer.innerHTML = '';

  if (!experience) return;

  const detail = document.createElement('article');
  detail.className = 'detail-card';
  detail.innerHTML = `
    <h3>${experience.title}</h3>
    <p>${experience.description}</p>
    <p><strong>Insider pairing:</strong> ${experience.addOn}</p>
  `;
  detailContainer.appendChild(detail);
};

const sortItinerary = () => {
  itineraryItems.sort((a, b) => {
    if (a.day === b.day) {
      return a.time.localeCompare(b.time);
    }
    return a.day - b.day;
  });
};

const plannerSummaryText = () => {
  if (!itineraryItems.length) {
    return 'No plans yet—start dreaming!';
  }

  const days = new Set(itineraryItems.map((item) => item.day));
  return `Curating ${itineraryItems.length} experiences across ${days.size} day${
    days.size > 1 ? 's' : ''
  }.`;
};

const renderItinerary = () => {
  itineraryList.innerHTML = '';
  itineraryEmpty.style.display = itineraryItems.length ? 'none' : 'block';
  plannerSummary.textContent = plannerSummaryText();

  itineraryItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'plan-item';
    li.dataset.id = item.id;
    li.innerHTML = `
      <span class="day">Day ${item.day}</span>
      <span class="time">${item.time}</span>
      <div>
        <p>${item.activity}</p>
      </div>
      <button type="button" aria-label="Remove">×</button>
    `;
    itineraryList.appendChild(li);
  });
};

const addItineraryItem = ({ day, time, activity }) => {
  const entry = {
    id: crypto.randomUUID(),
    day: Number(day),
    time,
    activity
  };
  itineraryItems.push(entry);
  sortItinerary();
  saveItinerary();
  renderItinerary();
};

const removeItineraryItem = (id) => {
  itineraryItems = itineraryItems.filter((item) => item.id !== id);
  saveItinerary();
  renderItinerary();
};

const populateNeighborhoods = () => {
  neighborhoods.forEach((hood) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="meta">${hood.mood}</div>
      <h3>${hood.name}</h3>
      <p>${hood.description}</p>
      <p><strong>Signature moment:</strong> ${hood.highlight}</p>
    `;
    neighborhoodGrid.appendChild(card);
  });
};

const surpriseMe = () => {
  const ideas =
    surpriseItineraries[Math.floor(Math.random() * surpriseItineraries.length)];
  if (!ideas) return;

  itineraryItems = ideas.map((idea, index) => ({
    id: crypto.randomUUID(),
    day: Math.min(index + 1, 7),
    time: index === 0 ? '08:30' : index === ideas.length - 1 ? '20:00' : '14:00',
    activity: idea
  }));
  sortItinerary();
  saveItinerary();
  renderItinerary();
};

const handleExperienceClick = (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;

  if (action === 'detail') {
    renderDetail(target.dataset.id);
  }

  if (action === 'add') {
    addItineraryItem({ day: 1, time: '12:00', activity: target.dataset.title });
  }
};

const handlePlanSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(planForm);
  const day = formData.get('day');
  const time = formData.get('time');
  const activity = formData.get('activity');

  if (!day || !time || !activity) return;

  addItineraryItem({ day, time, activity });
  planForm.reset();
};

const handleItineraryClick = (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.tagName.toLowerCase() !== 'button') return;

  const id = target.parentElement?.dataset.id;
  if (!id) return;

  removeItineraryItem(id);
};

const handleFilterClick = (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  filterButtons.forEach((button) => button.classList.remove('active'));
  target.classList.add('active');
  renderExperiences(target.dataset.filter ?? 'all');
};

const init = () => {
  renderExperiences();
  populateNeighborhoods();
  loadItinerary();
  sortItinerary();
  renderItinerary();
  yearSpan.textContent = new Date().getFullYear();
};

experienceGrid.addEventListener('click', handleExperienceClick);
filterButtons.forEach((button) =>
  button.addEventListener('click', handleFilterClick)
);
itineraryList.addEventListener('click', handleItineraryClick);
planForm.addEventListener('submit', handlePlanSubmit);
surpriseButton.addEventListener('click', surpriseMe);

document.addEventListener('DOMContentLoaded', init);
