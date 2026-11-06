import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CloudRain,
  CloudSun,
  Compass,
  FileText,
  HeartHandshake,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Mountain,
  Package,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Sun,
  Thermometer,
  Trees,
  Users,
  Utensils
} from "lucide-react";
import { Page, Reveal } from "../../components/common/Page.jsx";
import { SectionHeading } from "../../components/common/SectionHeading.jsx";
import { api } from "../../services/api.js";

const guideTabs = [
  { id: "altitude", slug: "altitude-acclimatization", label: "Altitude & Acclimatization", icon: Mountain },
  { id: "permits", slug: "permits-and-tims", label: "Permits & TIMS", icon: FileText },
  { id: "packing", slug: "packing-checklist", label: "Packing Checklist", icon: Package },
  { id: "seasons", slug: "seasons-and-weather", label: "Seasons & Weather", icon: Sun },
  { id: "culture", slug: "local-culture-and-etiquette", label: "Local Culture & Etiquette", icon: HeartHandshake },
  { id: "faq", slug: "trail-faqs", label: "Trail FAQs", icon: HelpCircle }
];

const initialPackingList = [
  {
    category: "Footwear & Socks",
    items: [
      { id: "boots", label: "Sturdy waterproof hiking boots (broken-in, high ankle support)", essential: true, checked: false },
      { id: "socks", label: "3–4 pairs of merino wool trekking socks & 2 liner socks", essential: true, checked: false },
      { id: "camp-shoes", label: "Lightweight sandals or down camp booties for teahouse evenings", essential: false, checked: false },
      { id: "gaiters", label: "Low gaiters (optional, great for snow or dust)", essential: false, checked: false }
    ]
  },
  {
    category: "Upper Body Layering",
    items: [
      { id: "thermal-top", label: "2x Synthetic or merino wool thermal base layer tops", essential: true, checked: false },
      { id: "trek-shirts", label: "2x Lightweight, breathable long-sleeve hiking shirts (UPF 50+)", essential: true, checked: false },
      { id: "fleece", label: "1x Mid-layer fleece or Polartec grid pullover", essential: true, checked: false },
      { id: "down-jacket", label: "Insulated jacket suitable for the expected conditions", essential: true, checked: false },
      { id: "hardshell", label: "Waterproof & windproof breathable Gore-Tex shell jacket", essential: true, checked: false }
    ]
  },
  {
    category: "Lower Body Layering",
    items: [
      { id: "thermal-bottom", label: "1–2x Thermal base layer leggings (merino wool)", essential: true, checked: false },
      { id: "trek-pants", label: "2x Quick-drying stretch hiking trousers", essential: true, checked: false },
      { id: "waterproof-pants", label: "Lightweight waterproof rain pants with side zips", essential: true, checked: false }
    ]
  },
  {
    category: "Headwear, Hands & Eyes",
    items: [
      { id: "beanie", label: "Warm fleece or wool beanie hat", essential: true, checked: false },
      { id: "sun-hat", label: "Wide-brim sun hat or baseball cap with neck cover", essential: true, checked: false },
      { id: "sunglasses", label: "Cat 3 or Cat 4 UV polarized glacier sunglasses", essential: true, checked: false },
      { id: "gloves-liner", label: "Lightweight touchscreen fleece liner gloves", essential: true, checked: false },
      { id: "gloves-heavy", label: "Waterproof windproof insulated mountaineering mitts/gloves", essential: true, checked: false },
      { id: "buff", label: "2x UV neck gaiters / Buffs (protects against dry Khumbu cough)", essential: true, checked: false }
    ]
  },
  {
    category: "Sleep & Packs",
    items: [
      { id: "sleeping-bag", label: "Sleeping bag suitable for the expected conditions, plus a liner if needed", essential: true, checked: false },
      { id: "daypack", label: "30L–35L Daypack with padded hip belt and rain cover", essential: true, checked: false },
      { id: "duffel", label: "80L–90L Heavy-duty water-resistant duffel bag (carried by porter)", essential: true, checked: false },
      { id: "trekking-poles", label: "Telescopic carbon or aluminum trekking poles with shock absorption", essential: true, checked: false }
    ]
  },
  {
    category: "Health, Hydration & Electronics",
    items: [
      { id: "water-bottles", label: "2x 1L Nalgene wide-mouth bottles (can hold boiling water)", essential: true, checked: false },
      { id: "water-purification", label: "Water purification tablets or SteriPEN / filtration filter", essential: true, checked: false },
      { id: "headlamp", label: "High-lumen LED headlamp with extra lithium batteries (cold drains batteries)", essential: true, checked: false },
      { id: "powerbank", label: "10,000–20,000 mAh high-capacity rugged power bank", essential: true, checked: false },
      { id: "medical-kit", label: "Personal first-aid supplies and medications recommended by your healthcare professional", essential: true, checked: false },
      { id: "sunscreen", label: "High SPF 50+ mineral sunscreen and zinc oxide lip balm", essential: true, checked: false }
    ]
  }
];

export function TrekkingGuidePage() {
  const { category: routeCategory } = useParams();
  const navigate = useNavigate();
  const activeTab = guideTabs.find((tab) => tab.slug === routeCategory)?.id || "altitude";
  const [packingList, setPackingList] = useState(initialPackingList);
  const [guideArticles, setGuideArticles] = useState([]);
  useEffect(() => {
    if (routeCategory && !guideTabs.some((tab) => tab.slug === routeCategory)) {
      navigate("/trekking-guides/altitude-acclimatization", { replace: true });
    }
  }, [routeCategory, navigate]);
  useEffect(() => {
    let active = true;
    api.guides.getAll()
      .then((response) => { if (active) setGuideArticles(response.guides || []); })
      .catch(() => { if (active) setGuideArticles([]); });
    return () => { active = false; };
  }, []);
  const altitudeReminders = [
    { id: "r1", title: "Plan conservatively:", text: "Choose an itinerary with an appropriate pace and discuss altitude risks with a qualified healthcare professional before travel." },
    { id: "r2", title: "Take symptoms seriously:", text: "Do not continue ascending when unwell. Seek help from a qualified guide and medical professional." },
    { id: "r3", title: "Know how to get help:", text: "Before setting out, confirm local emergency contacts, communications, and evacuation arrangements for your route." }
  ];
  const toggleItem = (catIndex, itemId) => {
    setPackingList((prev) =>
      prev.map((cat, idx) => {
        if (idx !== catIndex) return cat;
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        };
      })
    );
  };

  const totalItems = packingList.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedItems = packingList.reduce(
    (acc, cat) => acc + cat.items.filter((i) => i.checked).length,
    0
  );
  const packingProgress = Math.round((checkedItems / totalItems) * 100);

  return (
    <Page className="guide-page">
      {/* Guide Hero */}
      <section className="guide-hero section-wrap">
        <div className="guide-hero-copy">
          <p className="eyebrow">Before you head to the mountains</p>
          <h1>A practical guide<br /><em>to trekking in Nepal.</em></h1>
          <p className="guide-hero-desc">
            General planning information about altitude, packing, permits, and trail conditions. Requirements and conditions change, so confirm current details with official sources and qualified professionals.
          </p>
          <div className="guide-hero-badges">
            <span><ShieldCheck size={16} /> Plan a steady ascent</span>
            <span><Mountain size={16} /> Pack for the season</span>
            <span><HeartHandshake size={16} /> Travel with respect</span>
          </div>
        </div>
      </section>

      {/* Guide Navigation Tabs */}
      <section className="guide-nav-section section-wrap">
        <div className="guide-tabs-bar" role="tablist" aria-label="Trekking Guide Topics">
          {guideTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`guide-tab-button${isActive ? " is-active" : ""}`}
                to={`/trekking-guides/${tab.slug}`}
              >
                <Icon size={17} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Guide Content Sections */}
      <div className="guide-content section-wrap">
        {guideArticles.filter((article) => article.category === activeTab).map((article) => (
          <Reveal className="guide-pane" key={article._id || article.id}>
            <div className="guide-section-header">
              <span className="guide-tag">{article.categoryLabel || guideTabs.find((tab) => tab.id === article.category)?.label || "Trail Guide"}</span>
              <h2>{article.title}</h2>
              {article.summary && <p>{article.summary}</p>}
            </div>
            {article.content && <div className="guide-dynamic-copy">{article.content}</div>}
            {article.rules?.length > 0 && (
              <div className="guide-cards-grid">
                {article.rules.map((rule, index) => (
                  <article className="guide-feature-card" key={rule.id || `${article._id}-${index}`}>
                    <h3>{rule.title}</h3>
                    <p>{rule.text}</p>
                  </article>
                ))}
              </div>
            )}
          </Reveal>
        ))}
        {/* Tab 1: Altitude & Acclimatization */}
        {activeTab === "altitude" && (
          <Reveal className="guide-pane">
            <div className="guide-section-header">
              <span className="guide-tag">Altitude Health & Acclimatization</span>
              <h2>The Golden Rules of High Mountain Safety</h2>
              <p>
                High altitude can affect travelers differently, regardless of fitness. Use an itinerary suited to your experience and get individualized advice from a qualified healthcare professional.
              </p>
            </div>

            <div className="guide-alert-box">
              <div className="guide-alert-icon"><AlertTriangle size={28} /></div>
              <div className="guide-alert-text">
                <h3>General planning reminders</h3>
                <ul>
                  {altitudeReminders.map((rule, idx) => (
                    <li key={rule.id || idx}>
                      <strong>{rule.title} </strong>
                      <span>{rule.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="guide-cards-grid">
              <article className="guide-feature-card">
                <span className="card-num">01</span>
                <h3>Allow time to adjust</h3>
                <p>
                  Choose a route and pace appropriate to your experience. Discuss acclimatization and any personal health concerns with a qualified healthcare professional before departure.
                </p>
              </article>

              <article className="guide-feature-card">
                <span className="card-num">02</span>
                <h3>Plan for food and water</h3>
                <p>
                  Food and drinking-water access varies by route and season. Ask your operator what is available and how to treat water safely for your itinerary.
                </p>
              </article>

              <article className="guide-feature-card">
                <span className="card-num">03</span>
                <h3>Review the itinerary</h3>
                <p>
                  Check each day's elevation changes and planned rest days with a qualified guide or operator. The route catalog may not contain complete or medically reviewed advice.
                </p>
              </article>

              <article className="guide-feature-card">
                <span className="card-num">04</span>
                <h3>Medication questions</h3>
                <p>
                  Do not start, stop, or change medication based on this guide. Ask a qualified healthcare professional about altitude-related risks and any medication before travel.
                </p>
              </article>

            </div>

            <div className="symptoms-comparison">
              <h3>Recognizing Altitude Illness Stages</h3>
              <div className="symptoms-table-wrap">
                <table className="symptoms-table">
                  <thead>
                    <tr>
                      <th>Condition</th>
                      <th>Typical Symptoms</th>
                      <th>Required Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Possible altitude illness</strong></td>
                      <td>Symptoms can include headache, nausea, unusual fatigue, dizziness, or changes in coordination or breathing.</td>
                      <td>Stop ascending and seek prompt help from a qualified guide and medical professional. This page is not a diagnostic tool.</td>
                    </tr>
                    <tr>
                      <td><strong>Severe breathing symptoms</strong></td>
                      <td>Severe or worsening breathing difficulty at rest can be an emergency.</td>
                      <td><strong>Seek emergency assistance immediately.</strong> Follow qualified local responders' instructions.</td>
                    </tr>
                    <tr>
                      <td><strong>Severe neurological symptoms</strong></td>
                      <td>Confusion, loss of coordination, or a significant change in alertness can be an emergency.</td>
                      <td><strong>Seek emergency assistance immediately.</strong> Follow qualified local responders' instructions.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        )}

        {/* Tab 2: Permits & Regulations */}
        {activeTab === "permits" && (
          <Reveal className="guide-pane">
            <div className="guide-section-header">
              <span className="guide-tag">Permit planning · verify current requirements</span>
              <h2>Check requirements for your route</h2>
              <p>
                Permit rules, fees, and guide requirements can change and may depend on nationality, route, and season. The information below is a planning checklist, not an official or current fee schedule.
              </p>
            </div>

            <div className="permits-summary-banner">
              <div className="banner-icon"><Info size={22} /></div>
              <div>
                <h4>Confirm before departure</h4>
                <p>
                  Check the current requirements with the relevant government authority and your licensed local operator. Do not rely on this page to determine eligibility, required documents, guide rules, or permit costs.
                </p>
              </div>
            </div>

            <div className="permits-grid">
              <div className="permit-card">
                <div className="permit-card-header">
                  <h3>Khumbu & Everest Region</h3>
                  <span className="permit-price">Verify current fees</span>
                </div>
                <ul>
                  <li>Confirm protected-area and local entry permits for your itinerary.</li>
                  <li>Verify current fees, where permits are issued, and required documents.</li>
                </ul>
              </div>

              <div className="permit-card">
                <div className="permit-card-header">
                  <h3>Annapurna Conservation Area</h3>
                  <span className="permit-price">Verify current fees</span>
                </div>
                <ul>
                  <li>Confirm conservation-area and any route-specific permits.</li>
                  <li>Verify current fees, application locations, and required documents.</li>
                </ul>
              </div>

              <div className="permit-card">
                <div className="permit-card-header">
                  <h3>Langtang National Park</h3>
                  <span className="permit-price">Verify current fees</span>
                </div>
                <ul>
                  <li>Confirm national-park and any route-specific permits.</li>
                  <li>Verify current fees, application locations, and required documents.</li>
                </ul>
              </div>

              <div className="permit-card">
                <div className="permit-card-header">
                  <h3>Manaslu Restricted Area</h3>
                  <span className="permit-price">Verify current fees</span>
                </div>
                <ul>
                  <li>Check whether restricted-area permits or additional documentation apply.</li>
                  <li>Confirm current eligibility and guide or operator requirements with the relevant authorities.</li>
                </ul>
              </div>

            </div>
          </Reveal>
        )}

        {/* Tab 3: Interactive Gear Checklist */}
        {activeTab === "packing" && (
          <Reveal className="guide-pane">
            <div className="guide-section-header">
              <span className="guide-tag">Interactive Checklist</span>
              <h2>Himalayan Gear & Packing Essentials</h2>
              <p>
                The secret to packing for the Himalayas is the layering system. Days in the sun can be 18°C (64°F), 
                while nights at 5,000m plummet to -15°C (5°F). Check items off as you prepare your duffel!
              </p>
            </div>

            {/* Checklist Progress */}
            <div className="packing-progress-bar-wrap">
              <div className="progress-info">
                <span><strong>{checkedItems} of {totalItems} items packed</strong></span>
                <span className="percentage">{packingProgress}% Ready for the trail</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${packingProgress}%` }} />
              </div>
            </div>

            <div className="checklist-categories">
              {packingList.map((category, catIndex) => (
                <div key={category.category} className="checklist-category-card">
                  <h3>{category.category}</h3>
                  <div className="checklist-items-grid">
                    {category.items.map((item) => (
                      <label
                        key={item.id}
                        className={`checklist-item${item.checked ? " is-checked" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleItem(catIndex, item.id)}
                        />
                        <span className="custom-check">
                          {item.checked && <Check size={14} />}
                        </span>
                        <span className="item-label">
                          {item.label}
                          {item.essential && <span className="essential-badge">Essential</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="porter-weight-note">
              <Package size={20} />
              <div>
                <h4>Confirm baggage arrangements</h4>
                <p>
                  Porter services, baggage limits, and equipment arrangements vary by operator and route. Confirm the current policy with your operator and pack accordingly.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* Tab 4: Seasons & Weather */}
        {activeTab === "seasons" && (
          <Reveal className="guide-pane">
            <div className="guide-section-header">
              <span className="guide-tag">Seasonal patterns · conditions vary</span>
              <h2>Plan around the season and route</h2>
              <p>
                Nepal Tourism Board identifies spring and autumn as popular trekking windows. These are broad planning seasons: elevation, rain shadow, snowfall, and yearly weather can shift conditions substantially from one route to another.
              </p>
            </div>

            <div className="seasons-grid">
              <article className="season-card is-highlighted">
                <div className="season-icon"><CloudSun size={22} /></div>
                <div className="season-badge">Popular trekking window</div>
                <div className="season-title-row">
                  <h3>Autumn</h3>
                  <span>September–November</span>
                </div>
                <p className="season-desc">
                  Post-monsoon skies are often clearer, making autumn a popular time for mountain views. Trails and transport can still be affected by late rain, and temperatures fall as winter approaches.
                </p>
                <div className="season-specs">
                  <div><strong>Plan for:</strong> Busy trails and lodges in popular regions</div>
                  <div><strong>Pack:</strong> Layers for warm sun and cold mornings</div>
                  <div><strong>Before you go:</strong> Check local forecasts and route reports</div>
                </div>
              </article>

              <article className="season-card is-highlighted">
                <div className="season-icon"><Sun size={22} /></div>
                <div className="season-badge">Popular trekking window</div>
                <div className="season-title-row">
                  <h3>Spring</h3>
                  <span>February–May</span>
                </div>
                <p className="season-desc">
                  Days generally warm as spring advances, while high elevations can remain cold and exposed to snow or storms. Rhododendrons bloom in many hill and mountain areas, with timing varying by altitude.
                </p>
                <div className="season-specs">
                  <div><strong>Plan for:</strong> Changeable conditions at high passes</div>
                  <div><strong>Pack:</strong> Sun protection plus warm and waterproof layers</div>
                  <div><strong>Before you go:</strong> Ask about snow and pass access</div>
                </div>
              </article>

              <article className="season-card">
                <div className="season-icon"><Snowflake size={22} /></div>
                <div className="season-title-row">
                  <h3>Winter</h3>
                  <span>December–February</span>
                </div>
                <p className="season-desc">
                  Winter brings shorter days and much colder nights; Nepal Tourism Board notes that temperatures in mountain regions can fall below zero. Snow can make high passes or remote trails impassable, and some lodges or services may close. Lower-elevation routes can remain viable when conditions are suitable.
                </p>
                <div className="season-specs">
                  <div><strong>Plan for:</strong> Cold exposure, snow, and fewer daylight hours</div>
                  <div><strong>Pack:</strong> Insulating layers, wind protection, and a warm sleep system suited to the route</div>
                  <div><strong>Before you go:</strong> Confirm pass status, open lodges, and rescue options locally</div>
                </div>
              </article>

              <article className="season-card">
                <div className="season-icon"><CloudRain size={22} /></div>
                <div className="season-title-row">
                  <h3>Monsoon</h3>
                  <span>June–September</span>
                </div>
                <p className="season-desc">
                  Monsoon rain can reduce visibility and bring slippery paths, landslides, swollen rivers, and transport delays. Rain-shadow areas such as Mustang and Manang are comparatively dry, but local forecasts and route conditions still matter.
                </p>
                <div className="season-specs">
                  <div><strong>Plan for:</strong> Flexible days and weather-related delays</div>
                  <div><strong>Pack:</strong> Reliable rain protection and footwear with good grip</div>
                  <div><strong>Before you go:</strong> Check landslide, road, and flight updates</div>
                </div>
              </article>

              <article className="season-card">
                <div className="season-icon"><Sun size={22} /></div>
                <div className="season-title-row">
                  <h3>Summer / Pre-monsoon</h3>
                  <span>May–June transition</span>
                </div>
                <p className="season-desc">
                  Heat and humidity increase in lower Nepal as the monsoon approaches. Mountain mornings may begin clear, while cloud, rain, or storms can build later; conditions vary by elevation and year.
                </p>
                <div className="season-specs">
                  <div><strong>Plan for:</strong> Early starts and flexible daily targets</div>
                  <div><strong>Pack:</strong> Sun and rain protection, plus extra water capacity</div>
                  <div><strong>Before you go:</strong> Review current forecasts with your guide</div>
                </div>
              </article>

            </div>
            <div className="guide-source-note">
              <strong>Check before travel:</strong> These summaries are not forecasts. Confirm conditions for your route with your guide and official services.
              <a href="https://ntb.gov.np/plan-your-trip/about-nepal/climate" target="_blank" rel="noreferrer">Nepal Tourism Board climate information</a>
              <a href="https://dhm.gov.np/climate-services/seasonal-outlook" target="_blank" rel="noreferrer">Department of Hydrology and Meteorology outlooks</a>
            </div>
          </Reveal>
        )}

        {/* Tab 5: Culture & Teahouse Living */}
        {activeTab === "culture" && (
          <Reveal className="guide-pane">
            <div className="guide-section-header">
              <span className="guide-tag">The Human Heart of the Trails</span>
              <h2>Teahouse Living & Sherpa Cultural Etiquette</h2>
              <p>
                Trekking in Nepal is fundamentally an encounter with people whose ancestors 
                have navigated these high windswept valleys for centuries. Walking with respect 
                unlocks genuine warmth that no luxury hotel can match.
              </p>
            </div>

            <div className="culture-story-block">
              <div className="culture-story-quote">
                <p>
                  Learn about local customs from people in the communities you visit, and follow their guidance with respect.
                </p>
                <small>Respectful travel starts with listening.</small>
              </div>
            </div>

            <div className="guide-cards-grid">
              <article className="guide-feature-card">
                <div className="feature-icon"><Utensils size={20} /></div>
                <h3>Food and local services</h3>
                <p>
                  Menus, ingredients, prices, and availability vary. Ask accommodation providers about meals and any dietary needs before relying on a particular option.
                </p>
              </article>

              <article className="guide-feature-card">
                <div className="feature-icon"><Compass size={20} /></div>
                <h3>Respect sacred places</h3>
                <p>
                  Ask local hosts or guides about customs at religious and cultural sites. Follow posted guidance and avoid touching or photographing objects or people without permission.
                </p>
              </article>

              <article className="guide-feature-card">
                <div className="feature-icon"><HeartHandshake size={20} /></div>
                <h3>Greet people thoughtfully</h3>
                <p>
                  Greetings and customs differ between communities. Be courteous, listen, and follow the lead of local people rather than assuming one practice applies everywhere.
                </p>
              </article>

              <article className="guide-feature-card">
                <div className="feature-icon"><Users size={20} /></div>
                <h3>Ask about fair working practices</h3>
                <p>
                  Ask your operator about porter employment, pay, insurance, and luggage limits. Follow local trail guidance and make room for other travelers and pack animals where it is safe to do so.
                </p>
              </article>

              <article className="guide-feature-card">
                <div className="feature-icon"><ShieldCheck size={20} /></div>
                <h3>Check before entering sacred spaces</h3>
                <p>
                  Some temples restrict entry by religion or other local rules. Read signs, ask your host or guide, remove shoes where requested, and do not assume every site follows the same practice.
                </p>
              </article>

              <article className="guide-feature-card">
                <div className="feature-icon"><Sparkles size={20} /></div>
                <h3>Ask before taking photographs</h3>
                <p>
                  Ask permission before photographing people, ceremonies, or private spaces. Respect a refusal and follow any photography restrictions at monasteries and temples.
                </p>
              </article>

              <article className="guide-feature-card">
                <div className="feature-icon"><Trees size={20} /></div>
                <h3>Support the places hosting your trek</h3>
                <p>
                  Use local services where practical, carry out waste that cannot be handled locally, and ask your guide how to reduce pressure on water, fuel, and fragile trails.
                </p>
              </article>

            </div>
            <div className="guide-source-note">
              Customs differ across Nepal's communities and faith traditions. Ask your local host or guide and follow site-specific instructions.
              <a href="https://trade.ntb.gov.np/travel-essentials/cultural-etiquette/" target="_blank" rel="noreferrer">Nepal Tourism Board cultural etiquette</a>
            </div>
          </Reveal>
        )}

        {/* Tab 6: FAQs */}
        {activeTab === "faq" && (
          <Reveal className="guide-pane">
            <div className="guide-section-header">
              <span className="guide-tag">Common Inquiries</span>
              <h2>Frequently Asked Trail Questions</h2>
              <p>These general answers are not route-specific. Confirm details with your operator before travel.</p>
            </div>

            <div className="guide-faq-accordion">
              <details className="guide-faq-item" open>
                <summary>How should I prepare physically?</summary>
                <p>
                  Fitness needs depend on the route, duration, and conditions. Review the published trek details and ask the operator or a qualified healthcare professional how to prepare for your circumstances.
                </p>
              </details>

              <details className="guide-faq-item">
                <summary>Can I charge my phone, camera batteries, and power bank on the trail?</summary>
                <p>
                  Charging access and fees vary by lodge and route. Confirm availability locally and ask your operator what backup power is appropriate for your trip.
                </p>
              </details>

              <details className="guide-faq-item">
                <summary>Is there internet / Wi-Fi available on the treks?</summary>
                <p>
                  Coverage, providers, and service availability vary by region and can change. Do not rely on mobile or internet access for emergency communication; confirm current options for your route.
                </p>
              </details>

              <details className="guide-faq-item">
                <summary>What happens if I get sick or injured high on the mountain?</summary>
                <p>
                  Emergency response and evacuation options depend on location, weather, and available services. Ask your operator about emergency procedures and review suitable travel insurance with your insurer before departure.
                </p>
              </details>

              <details className="guide-faq-item">
                <summary>How are bathrooms and showers in the teahouses?</summary>
                <p>
                  Facilities vary by accommodation and route. Ask your operator or lodging provider about bathroom, shower, and accessibility arrangements.
                </p>
              </details>

            </div>
          </Reveal>
        )}
      </div>

      {/* Explore Treks Callout */}
      <section className="guide-cta-section section-wrap">
        <div className="guide-cta-card">
          <div className="guide-cta-copy">
            <p className="eyebrow">Ready to take the first step?</p>
            <h2>Explore our handcrafted Himalayan expeditions.</h2>
            <p>From the iconic trails of Khumbu to the sacred silence of Manaslu, find the trail made for you.</p>
          </div>
          <div className="guide-cta-actions">
            <Link to="/treks" className="button button-ivory">Explore all treks <ArrowRight size={16} /></Link>
            <Link to="/contact" className="button button-outline">Ask a Sherpa guide <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
