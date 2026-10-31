import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Heart, Sparkles } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { DemoBanner, Image, allSeasons } from "../../components/common/PagePrimitives.jsx";
import { treks } from "../../data/index.js";
import { useFavorites } from "../../context/FavoritesContext.jsx";

const finderSteps = [
  { key: "days", title: "How much time do you have?", prompt: "Think about the days you can spend walking, not counting international travel.", options: ["1–6 days", "7–12 days", "13+ days"] },
  { key: "budget", title: "What feels comfortable for your budget?", prompt: "Sample prices are indicative per person and for demonstration only.", options: ["Under $900", "$900–$1,500", "$1,500+"] },
  { key: "region", title: "Which landscape is calling?", prompt: "Not sure? Choose “Surprise me” and let the trail decide.", options: ["Surprise me", "Khumbu", "Annapurna", "Langtang", "Manaslu"] },
  { key: "difficulty", title: "What kind of challenge sounds right?", prompt: "Be honest about how you feel today. You can always build experience.", options: ["Easy", "Moderate", "Challenging", "No preference"] },
  { key: "scenery", title: "What would you love to see?", prompt: "Choose the scenery that makes you want to lace up your boots.", options: ["High peaks", "Forest", "Culture", "Remote"] },
  { key: "elevation", title: "How high would you like to go?", prompt: "Maximum elevations are approximate and must be checked against a current itinerary.", options: ["Under 3,500 m", "3,500–4,500 m", "4,500 m+"] },
  { key: "season", title: "When might you travel?", prompt: "Season guidance here is general; mountain conditions can vary.", options: allSeasons },
  { key: "interest", title: "What would make the journey meaningful?", prompt: "Choose an interest to help shape your shortlist. Wildlife interest is not a sighting guarantee.", options: ["Culture", "Photography", "Wildlife", "Remote"] },
];

function scoreRecommendations(answers) {
  const dayMatch = (trek) =>
    answers.days === "1–6 days" ? trek.duration <= 6 :
      answers.days === "7–12 days" ? trek.duration >= 7 && trek.duration <= 12 :
        trek.duration >= 13;
  const priceMatch = (trek) =>
    answers.budget === "Under $900" ? trek.price < 900 :
      answers.budget === "$900–$1,500" ? trek.price >= 900 && trek.price <= 1500 :
        trek.price > 1500;
  const elevationMatch = (trek) =>
    answers.elevation === "Under 3,500 m" ? trek.elevation < 3500 :
      answers.elevation === "3,500–4,500 m" ? trek.elevation >= 3500 && trek.elevation <= 4500 :
      trek.elevation > 4500;
  const matches = treks.filter((trek) =>
    dayMatch(trek) &&
    priceMatch(trek) &&
    (answers.region === "Surprise me" || trek.region === answers.region) &&
    (answers.difficulty === "No preference" || trek.difficulty === answers.difficulty) &&
    trek.scenery.includes(answers.scenery) &&
    elevationMatch(trek) &&
    trek.season.includes(answers.season) &&
    trek.interests.includes(answers.interest),
  );

  return matches
    .map((trek) => ({
      trek,
      reasons: [
        `${trek.duration} days fits your ${answers.days} window`,
        answers.region === "Surprise me" ? `${trek.region} is ready to surprise you` : `In your chosen region: ${trek.region}`,
        `Matches your ${answers.difficulty.toLowerCase()} preference`,
        `Offers ${answers.scenery.toLowerCase()} scenery`,
        `Stays within your ${answers.elevation} preference`,
        `A good seasonal match for ${answers.season.toLowerCase()}`,
        `Matches your interest in ${answers.interest.toLowerCase()}`,
      ],
    }))
    .sort((a, b) => a.trek.price - b.trek.price);
}

export function FinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const { isSaved, toggleSaved } = useFavorites();
  const notify = useToast();
  const current = finderSteps[step];

  const chooseAnswer = (value) => setAnswers((previous) => ({ ...previous, [current.key]: value }));
  const reset = () => { setAnswers({}); setStep(0); setResults(null); };
  const handleNext = () => {
    if (!answers[current.key]) return;
    if (step === finderSteps.length - 1) setResults(scoreRecommendations(answers));
    else setStep((previous) => previous + 1);
  };

  return (
    <Page className="finder-page">
      <DemoBanner />
      <section className="finder-shell section-wrap">
        <div className="finder-aside">
          <p className="eyebrow">A thoughtful starting point</p>
          <h1>Find the<br /><em>trail that fits.</em></h1>
          <p>Eight quick questions. Clear reasons. No mysterious algorithms, and no account needed.</p>
          <div className="finder-aside-note"><Sparkles size={16} /><span>Recommendations use a transparent rules-based match on demo treks.</span></div>
          <Link className="text-link" to="/treks">Browse every trek instead <ArrowUpRight size={15} /></Link>
        </div>
        <div className="finder-card">
          {!results ? (
            <>
              <div className="finder-progress-top"><span>STEP {step + 1} <span className="finder-progress-muted">OF {finderSteps.length}</span></span><div className="finder-progress-actions"><span>{Math.round(((step + 1) / finderSteps.length) * 100)}%</span><button className="finder-restart" type="button" onClick={reset}>Start over</button></div></div>
              <div className="finder-progress"><span style={{ width: `${((step + 1) / finderSteps.length) * 100}%` }} /></div>
              <div className="finder-question">
                <p className="eyebrow">Let's get a feel for it</p>
                <h2>{current.title}</h2>
                <p>{current.prompt}</p>
                <div className={`finder-options${current.options.length > 4 ? " finder-options-compact" : ""}`} role="radiogroup" aria-label={current.title}>
                  {current.options.map((option) => (
                    <label className={`finder-option${answers[current.key] === option ? " is-selected" : ""}`} key={option}>
                      <input className="finder-radio" type="radio" name={`finder-${current.key}`} value={option} checked={answers[current.key] === option} onChange={() => chooseAnswer(option)} />
                      <span>{option}</span>{answers[current.key] === option && <Check size={16} />}
                    </label>
                  ))}
                </div>
              </div>
              <div className="finder-controls">
                <button className="button button-outline" type="button" onClick={() => step === 0 ? reset() : setStep((previous) => previous - 1)} disabled={step === 0}><ArrowLeft size={15} /> Back</button>
                <button className="button button-dark" type="button" onClick={handleNext} disabled={!answers[current.key]}>{step === finderSteps.length - 1 ? "Show my matches" : "Continue"} <ArrowRight size={15} /></button>
              </div>
              <p className="finder-validation" aria-live="polite">{!answers[current.key] ? "Choose an option to continue." : "Your answer is saved for this session."}</p>
            </>
          ) : (
            <div className="finder-results">
              <p className="eyebrow">Your trail, your way</p>
              <h2>{results.length ? `${results.length} possible ${results.length === 1 ? "match" : "matches"}.` : "A little more flexibility may help."}</h2>
              <p className="finder-results-copy">
                {results.length ? "These demo journeys match every answer you chose. Here’s what connected." : "No sample trek matches every answer exactly. Try relaxing a preference, or browse all demo journeys."}
              </p>
              {results.length ? (
                <div className="finder-results-list">
                  {results.map(({ trek, reasons }) => (
                    <article className="finder-result" key={trek.slug}>
                      <Image src={trek.image} alt={trek.imageAlt} />
                      <div><span className="eyebrow">{trek.region} · {trek.duration} days · ${trek.price.toLocaleString()} indicative</span><h3><Link to={`/treks/${trek.slug}`}>{trek.title}</Link></h3><p>{reasons.join(" · ")}</p><button className={`finder-save${isSaved(trek.slug) ? " is-saved" : ""}`} type="button" aria-pressed={isSaved(trek.slug)} onClick={() => { toggleSaved(trek.slug); notify(isSaved(trek.slug) ? "Removed from saved treks" : "Added to your saved treks"); }}><Heart size={13} fill={isSaved(trek.slug) ? "currentColor" : "none"} /> {isSaved(trek.slug) ? "Saved" : "Save this trek"}</button></div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="finder-empty-actions"><Link className="button button-dark" to="/treks">Browse all treks <ArrowUpRight size={15} /></Link><button className="button button-outline" type="button" onClick={reset}>Try again</button></div>
              )}
              <div className="finder-result-actions">
                <button className="text-link" type="button" onClick={reset}><ArrowLeft size={15} /> Start over</button>
                <Link className="text-link" to="/treks">Browse all treks <ArrowUpRight size={15} /></Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </Page>
  );
}
