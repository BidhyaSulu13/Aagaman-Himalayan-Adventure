import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
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
  Sparkles,
  Sun,
  Thermometer,
  Trees,
  Users,
  Utensils
} from "lucide-react";
import { Page, Reveal } from "../../components/common/Page.jsx";
import { SectionHeading } from "../../components/common/SectionHeading.jsx";
import { useGuides } from "../../hooks/useDataStore.js";

const guideTabs = [
  { id: "altitude", label: "Altitude & Acclimatization", icon: Mountain },
  { id: "permits", label: "Permits & TIMS", icon: FileText },
  { id: "packing", label: "Packing Checklist", icon: Package },
  { id: "seasons", label: "Seasons & Weather", icon: Sun },
  { id: "culture", label: "Teahouse & Sherpa Culture", icon: HeartHandshake },
  { id: "faq", label: "Trail FAQs", icon: HelpCircle }
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
      { id: "down-jacket", label: "High-loft down jacket (-15°C to -20°C rated, 700+ fill power)", essential: true, checked: false },
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
      { id: "sleeping-bag", label: "4-Season sleeping bag (-15°C comfort rating) + silk liner", essential: true, checked: false },
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
      { id: "medical-kit", label: "Personal med kit: Diamox (Acetazolamide), Ibuprofen, rehydration salts, blister pads (Compeed), Ciprofloxacin", essential: true, checked: false },
      { id: "sunscreen", label: "High SPF 50+ mineral sunscreen and zinc oxide lip balm", essential: true, checked: false }
    ]
  }
];

export function TrekkingGuidePage() {
  const [activeTab, setActiveTab] = useState("altitude");
  const [packingList, setPackingList] = useState(initialPackingList);
  const guides = useGuides();

  const altitudeRulesGuide = guides.find((g) => g.type === "rules" || g.id === "guide-altitude-rules");
  const dynamicRules = altitudeRulesGuide?.rules || [
    { id: "r1", title: "Never ascend with symptoms of AMS:", text: "If you have a persistent headache, nausea, or dizziness, you MUST stay at your current altitude until fully resolved." },
    { id: "r2", title: "If symptoms worsen, descend immediately:", text: "Descending just 300 to 500 meters is often the single most life-saving intervention. Never wait until morning if symptoms escalate." },
    { id: "r3", title: "Never leave a sick trekker alone:", text: "Always descend accompanied by an experienced Sherpa guide or fellow trekker." }
  ];

  const dynamicArticles = guides.filter((g) => g.category === activeTab && g.type === "article");

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
            A few useful things to know before you go: how to plan for altitude, what to pack, how permits work, and what to expect on the trail.
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
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`guide-tab-button${isActive ? " is-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={17} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Guide Content Sections */}
      <div className="guide-content section-wrap">
        {/* Tab 1: Altitude & Acclimatization */}
        {activeTab === "altitude" && (
          <Reveal className="guide-pane">
            <div className="guide-section-header">
              <span className="guide-tag">Altitude Health & Acclimatization</span>
              <h2>The Golden Rules of High Mountain Safety</h2>
              <p>
                Above 3,000 meters (9,840 ft), the air contains fewer oxygen molecules per breath. 
                Altitude sickness (AMS) does not care about your fitness level—it respects only patience, 
                hydration, and sensible ascent profiles.
              </p>
            </div>

            <div className="guide-alert-box">
              <div className="guide-alert-icon"><AlertTriangle size={28} /></div>
              <div className="guide-alert-text">
                <h3>{altitudeRulesGuide?.title || "The 3 Ironclad Rules of High Altitude"}</h3>
                <ul>
                  {dynamicRules.map((rule, idx) => (
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
                <h3>"Bistarai, Bistarai" — Pace is Everything</h3>
                <p>
                  In Nepali, "Bistarai" means slowly. Even if you feel bursting with energy on day 3, 
                  keep your heart rate low and conversational. Your body needs every bit of metabolic energy 
                  to produce new red blood cells.
                </p>
              </article>

              <article className="guide-feature-card">
                <span className="card-num">02</span>
                <h3>The 4-Liter Hydration Rule</h3>
                <p>
                  Cold high-altitude air is bone-dry; you lose significant moisture simply by breathing. 
                  Aim for 4 liters of warm liquids daily—hot lemon honey tea, ginger water, and local garlic soup 
                  (revered by Sherpas for stimulating circulation).
                </p>
              </article>

              <article className="guide-feature-card">
                <span className="card-num">03</span>
                <h3>Climb High, Sleep Low</h3>
                <p>
                  Our itineraries build in active acclimatization hikes (such as walking up to 3,880m at 
                  Hotel Everest View and returning to sleep at 3,440m in Namche Bazaar). This triggers erythropoietin 
                  production while letting you sleep with richer ambient oxygen.
                </p>
              </article>

              <article className="guide-feature-card">
                <span className="card-num">04</span>
                <h3>Diamox (Acetazolamide) Insights</h3>
                <p>
                  Diamox helps your kidneys excrete bicarbonate, making your blood slightly more acidic 
                  which signals your brain to breathe faster during sleep. Consult your travel doctor: 
                  typical dose is 125mg twice daily starting 24h before reaching 3,000m.
                </p>
              </article>

              {dynamicArticles.map((art, idx) => (
                <article className="guide-feature-card" key={art.id || idx}>
                  <span className="card-num">{(idx + 5).toString().padStart(2, "0")}</span>
                  <h3>{art.title}</h3>
                  <p>{art.content || art.summary}</p>
                </article>
              ))}
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
                      <td><strong>Mild AMS (Common)</strong></td>
                      <td>Mild throbbing headache, slight fatigue, reduced appetite, restless sleep.</td>
                      <td>Rest, hydrate, take Ibuprofen, do NOT ascend until symptoms clear.</td>
                    </tr>
                    <tr>
                      <td><strong>HAPE (High Altitude Pulmonary Edema)</strong></td>
                      <td>Persistent dry cough progressing to pink frothy phlegm, extreme breathlessness at rest, blue lips/nails.</td>
                      <td><strong>CRITICAL EMERGENCY:</strong> Immediate descent, administer bottled oxygen, emergency helicopter evacuation.</td>
                    </tr>
                    <tr>
                      <td><strong>HACE (High Altitude Cerebral Edema)</strong></td>
                      <td>Loss of physical coordination (inability to walk heel-to-toe), severe confusion, hallucinations, irrational behavior.</td>
                      <td><strong>CRITICAL EMERGENCY:</strong> Immediate descent with Gamow bag / oxygen and urgent evacuation.</td>
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
              <span className="guide-tag">Official Regulations · 2026 Policy</span>
              <h2>Nepal Trekking Permits & Mandatory Guide Rules</h2>
              <p>
                Navigating Nepal’s permit system is easy when you understand how each conservation area 
                is managed. Below is the official breakdown for all major regions.
              </p>
            </div>

            <div className="permits-summary-banner">
              <div className="banner-icon"><Info size={22} /></div>
              <div>
                <h4>Mandatory Guide Regulation (Updated)</h4>
                <p>
                  Under Nepal Tourism Board regulations, foreign solo trekkers are required to be accompanied by a 
                  licensed, government-certified trekking guide in national park and conservation areas. 
                  All our expeditions include fully licensed Sherpa guides and comprehensive permit processing.
                </p>
              </div>
            </div>

            <div className="permits-grid">
              <div className="permit-card">
                <div className="permit-card-header">
                  <h3>Khumbu & Everest Region</h3>
                  <span className="permit-price">$55 total</span>
                </div>
                <ul>
                  <li><strong>Sagarmatha National Park Permit:</strong> NPR 3,000 (~$25) + 13% VAT</li>
                  <li><strong>Khumbu Pasang Lhamu Rural Municipality Fee:</strong> NPR 2,000 (~$17)</li>
                  <li><strong>TIMS Card:</strong> Replaced in Khumbu by local municipal entry cards</li>
                  <li><em>Where to get:</em> Monjo check-post or Lukla airport entrance</li>
                </ul>
              </div>

              <div className="permit-card">
                <div className="permit-card-header">
                  <h3>Annapurna Conservation Area</h3>
                  <span className="permit-price">$45 total</span>
                </div>
                <ul>
                  <li><strong>ACAP (Annapurna Conservation Area Permit):</strong> NPR 3,000 (~$25)</li>
                  <li><strong>TIMS Card (Green / Blue):</strong> NPR 2,000 (~$17)</li>
                  <li><em>Where to get:</em> Nepal Tourism Board office in Kathmandu or Pokhara</li>
                  <li><em>Required documents:</em> 4 passport photos & passport photocopy</li>
                </ul>
              </div>

              <div className="permit-card">
                <div className="permit-card-header">
                  <h3>Langtang National Park</h3>
                  <span className="permit-price">$45 total</span>
                </div>
                <ul>
                  <li><strong>Langtang National Park Entry:</strong> NPR 3,000 (~$25)</li>
                  <li><strong>TIMS Card:</strong> NPR 2,000 (~$17)</li>
                  <li><em>Where to get:</em> Dhunche military checkpoint or Kathmandu NTB</li>
                  <li><em>Good for:</em> Langtang Valley, Gosainkunda, and Helambu trails</li>
                </ul>
              </div>

              <div className="permit-card">
                <div className="permit-card-header">
                  <h3>Manaslu Restricted Area</h3>
                  <span className="permit-price">$160+ total</span>
                </div>
                <ul>
                  <li><strong>Special Restricted Area Permit (RAP):</strong> $100/week (Autumn) or $75/week (Spring)</li>
                  <li><strong>MCAP (Manaslu Conservation) & ACAP:</strong> NPR 3,000 each (~$50)</li>
                  <li><em>Rule:</em> Must be booked through a registered Nepal agency with minimum 2 trekkers + licensed guide</li>
                </ul>
              </div>

              {dynamicArticles.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#1e293b", marginBottom: "16px" }}>
                    Additional Official Notices & Guidelines
                  </h3>
                  <div className="permits-grid">
                    {dynamicArticles.map((art) => (
                      <div key={art.id} className="permit-card" style={{ borderLeft: "4px solid #083c34" }}>
                        <div className="permit-card-header">
                          <h3>{art.title}</h3>
                          <span className="permit-price">Advisory</span>
                        </div>
                        <p style={{ marginTop: "8px", fontSize: "0.93rem", color: "#475569", lineHeight: "1.6" }}>
                          {art.content || art.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <h4>Porter Weight Limit Reminder (12–15 kg per trekker)</h4>
                <p>
                  We adhere strictly to the International Porter Protection Group (IPPG) guidelines. 
                  One porter carries gear for two trekkers up to a maximum total of 25–30 kg (meaning 12–15 kg / 26–33 lbs 
                  for your main duffel). Your daily backpack should only weigh 5–7 kg with water, camera, and warm layers.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* Tab 4: Seasons & Weather */}
        {activeTab === "seasons" && (
          <Reveal className="guide-pane">
            <div className="guide-section-header">
              <span className="guide-tag">Weather Windows</span>
              <h2>Best Himalayan Seasons: When to Walk</h2>
              <p>
                Nepal experiences distinct mountain climatic windows. Choosing the right month 
                determines your views, temperatures, and trail crowd levels.
              </p>
            </div>

            <div className="seasons-grid">
              <div className="season-card is-highlighted">
                <div className="season-badge">Top Recommendation</div>
                <div className="season-title-row">
                  <h3>Autumn (Late Sept – November)</h3>
                  <span>Peak Clarity</span>
                </div>
                <p className="season-desc">
                  Post-monsoon skies are washed crystal-clear. Outstanding mountain panoramas, warm pleasant daytime temperatures (14°C to 18°C), and reliable flight windows into Lukla and Pokhara.
                </p>
                <div className="season-specs">
                  <div><strong>Day Temp:</strong> 12°C to 18°C</div>
                  <div><strong>Night at 5000m:</strong> -10°C to -15°C</div>
                  <div><strong>Trail Vibe:</strong> Vibrant & social</div>
                </div>
              </div>

              <div className="season-card is-highlighted">
                <div className="season-badge">Wildflower Bloom</div>
                <div className="season-title-row">
                  <h3>Spring (March – May)</h3>
                  <span>Rhododendrons & Longer Days</span>
                </div>
                <p className="season-desc">
                  Hillsides burst into vibrant red, pink, and white rhododendron blossoms. Warmer mornings and longer daylight hours. You will also see mountaineering climbing teams setting up at Everest Base Camp.
                </p>
                <div className="season-specs">
                  <div><strong>Day Temp:</strong> 15°C to 20°C</div>
                  <div><strong>Night at 5000m:</strong> -8°C to -12°C</div>
                  <div><strong>Trail Vibe:</strong> Lush & colorful</div>
                </div>
              </div>

              <div className="season-card">
                <div className="season-title-row">
                  <h3>Winter (December – February)</h3>
                  <span>Crisp Cold & Solitude</span>
                </div>
                <p className="season-desc">
                  Deep blue skies and virtually empty trails. However, high passes like Thorong La and Larkya La can close under heavy snow, and high lodge dining halls are freezing after sunset.
                </p>
                <div className="season-specs">
                  <div><strong>Day Temp:</strong> 5°C to 10°C</div>
                  <div><strong>Night at 5000m:</strong> -20°C to -25°C</div>
                  <div><strong>Trail Vibe:</strong> Silent solitude</div>
                </div>
              </div>

              <div className="season-card">
                <div className="season-title-row">
                  <h3>Monsoon (June – August)</h3>
                  <span>Rainshadow Journeys</span>
                </div>
                <p className="season-desc">
                  Lower trails are lush but subject to mud, heavy rain, and leeches. However, Upper Mustang and Dolpo sit in the Himalayan rainshadow beyond the Annapurnas, making summer their ideal season!
                </p>
                <div className="season-specs">
                  <div><strong>Day Temp:</strong> 20°C to 26°C</div>
                  <div><strong>Rain:</strong> Heavy in south, zero in Mustang</div>
                  <div><strong>Trail Vibe:</strong> Agricultural life</div>
                </div>
              </div>

              {dynamicArticles.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#1e293b", marginBottom: "16px" }}>
                    Seasonal Advisories & Micro-Climate Guides
                  </h3>
                  <div className="seasons-grid">
                    {dynamicArticles.map((art) => (
                      <div key={art.id} className="season-card">
                        <div className="season-title-row">
                          <h3>{art.title}</h3>
                          <span>Trail Advisory</span>
                        </div>
                        <p className="season-desc">{art.content || art.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  "In the evening, when the wind howls against the lodge tin roof, we gather around 
                  the bukhari wood stove. The smoke smells of juniper, the tea kettle whistles, 
                  and strangers from six continents become friends over steaming plates of Dal Bhat."
                </p>
                <small>— Ang Norbu Sherpa, Senior Lead Guide</small>
              </div>
            </div>

            <div className="guide-cards-grid">
              <article className="guide-feature-card">
                <div className="feature-icon"><Utensils size={20} /></div>
                <h3>The Power of Dal Bhat</h3>
                <p>
                  "Dal Bhat Power 24 Hour!" Steaming mountain rice, slow-simmered spiced lentil soup, 
                  mustard greens, and potato curry. Teahouses always offer complimentary refills until 
                  you are completely full. It is the purest, healthiest fuel for walking.
                </p>
              </article>

              <article className="guide-feature-card">
                <div className="feature-icon"><Compass size={20} /></div>
                <h3>Clockwise Around Sacred Sites</h3>
                <p>
                  Always pass Buddhist chortens, stupas, and carved mani stone walls keeping them on your 
                  <strong> right-hand side</strong> (walking clockwise). Spin prayer wheels clockwise 
                  while whispering <em>"Om Mani Padme Hum"</em>.
                </p>
              </article>

              <article className="guide-feature-card">
                <div className="feature-icon"><HeartHandshake size={20} /></div>
                <h3>Namaste & Tashi Delek</h3>
                <p>
                  Greet locals with palms pressed together at chest height and a warm "Namaste" (in Hindu and middle hills) 
                  or "Tashi Delek" (in Tibetan Buddhist high mountain communities like Khumbu and Manang). 
                  A warm smile opens every door.
                </p>
              </article>

              <article className="guide-feature-card">
                <div className="feature-icon"><Users size={20} /></div>
                <h3>Fair Porter Treatment & Tipping</h3>
                <p>
                  Porters are the unsung champions of the Himalayas. Always greet them respectfully on the path, 
                  step into the mountain side (never the cliff edge!) to let yak trains pass, and budget a 
                  customary tip of ~$15–$20/day total split among your trekking group.
                </p>
              </article>

              {dynamicArticles.length > 0 && (
                <div style={{ marginTop: "24px", gridColumn: "1 / -1" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#1e293b", marginBottom: "16px" }}>
                    Community & Monastery Etiquette Guides
                  </h3>
                  <div className="guide-cards-grid">
                    {dynamicArticles.map((art) => (
                      <article className="guide-feature-card" key={art.id}>
                        <div className="feature-icon"><HeartHandshake size={20} /></div>
                        <h3>{art.title}</h3>
                        <p>{art.content || art.summary}</p>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        )}

        {/* Tab 6: FAQs */}
        {activeTab === "faq" && (
          <Reveal className="guide-pane">
            <div className="guide-section-header">
              <span className="guide-tag">Common Inquiries</span>
              <h2>Frequently Asked Trail Questions</h2>
              <p>Everything you were curious to ask before booking your flights.</p>
            </div>

            <div className="guide-faq-accordion">
              <details className="guide-faq-item" open>
                <summary>How fit do I really need to be for Everest Base Camp or Annapurna?</summary>
                <p>
                  You do not need to be a marathon runner or elite athlete. You need good cardiovascular stamina 
                  and the mental determination to walk 5 to 7 hours uphill daily with a daypack. Regular stair climbing, 
                  weekend trail walking, and leg endurance exercises 2–3 months before your trip are ideal preparation.
                </p>
              </details>

              <details className="guide-faq-item">
                <summary>Can I charge my phone, camera batteries, and power bank on the trail?</summary>
                <p>
                  Yes, almost all teahouse lodges have solar or hydroelectric power in the dining hall. 
                  Charging is usually charged at NPR 200–500 ($2–$4) per full charge, and prices increase with elevation. 
                  We strongly recommend bringing a 20,000 mAh power bank and keeping batteries inside your sleeping bag at night 
                  to prevent freezing drains.
                </p>
              </details>

              <details className="guide-faq-item">
                <summary>Is there internet / Wi-Fi available on the treks?</summary>
                <p>
                  Yes! In the Khumbu region, AirDijital and Everest Link provide prepaid Wi-Fi cards ($5 to $10 for 10–20 GB) 
                  that work well up to Gorak Shep. In Annapurna, most teahouses offer Wi-Fi for a modest fee ($2–$3). 
                  Ncell and Nepal Telecom (NTC) SIM cards purchased in Kathmandu also provide 4G data along lower valleys.
                </p>
              </details>

              <details className="guide-faq-item">
                <summary>What happens if I get sick or injured high on the mountain?</summary>
                <p>
                  All our lead Sherpa guides carry satellite communication devices and first aid kits with pulse oximeters. 
                  If altitude sickness or injury requires evacuation, we coordinate immediate helicopter rescue directly to 
                  an accredited international hospital in Kathmandu. This is why having emergency medical helicopter insurance 
                  covering up to 6,000 meters is mandatory.
                </p>
              </details>

              <details className="guide-faq-item">
                <summary>How are bathrooms and showers in the teahouses?</summary>
                <p>
                  In lower elevations (Namche, Ulleri, Chhomrong), many teahouses now offer rooms with attached bathrooms 
                  and gas-heated hot showers. Above 4,000m, bathrooms are shared (often squat toilets, kept clean), 
                  and hot showers are provided as hot water bucket baths for $3–$5. Above 4,500m, we advise using wet wipes 
                  instead of showering to avoid catching chills!
                </p>
              </details>

              {dynamicArticles.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#1e293b", marginBottom: "16px" }}>
                    Additional Trail Inquiries & Updates
                  </h3>
                  {dynamicArticles.map((art) => (
                    <details className="guide-faq-item" key={art.id} open>
                      <summary>{art.title}</summary>
                      <p>{art.content || art.summary}</p>
                    </details>
                  ))}
                </div>
              )}
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
