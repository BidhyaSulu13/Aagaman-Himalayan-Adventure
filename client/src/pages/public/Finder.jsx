import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Heart, Sparkles } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { Image } from "../../components/common/PagePrimitives.jsx";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import { api } from "../../services/api.js";

const baseFinderSteps = [
  { key: "days", title: "How much time do you have?", prompt: "Choose the trek duration that fits your available time.", options: ["Any duration", "1–6 days", "7–12 days", "13+ days"] },
  { key: "budget", title: "What budget works for you?", prompt: "Prices are taken from the published trek records.", options: ["Any budget", "Under $900", "$900–$1,500", "$1,500+"] },
  { key: "region", title: "Which region would you like to explore?", prompt: "Choose from regions represented in the published trek catalog.", options: [] },
  { key: "difficulty", title: "What difficulty suits you?", prompt: "Difficulty options reflect the published trek records.", options: [] },
  { key: "elevation", title: "How high would you like to go?", prompt: "Elevation ranges use each trek's maximum elevation in the database.", options: ["Any elevation", "Under 3,500 m", "3,500–4,500 m", "4,500 m+"] },
];

function scoreRecommendations(answers, treks) {
  const dayMatch = (trek) =>
    answers.days === "Any duration" ? true :
      answers.days === "1–6 days" ? trek.duration <= 6 :
      answers.days === "7–12 days" ? trek.duration >= 7 && trek.duration <= 12 :
        trek.duration >= 13;
  const priceMatch = (trek) =>
    answers.budget === "Any budget" ? true :
      answers.budget === "Under $900" ? trek.price < 900 :
      answers.budget === "$900–$1,500" ? trek.price >= 900 && trek.price <= 1500 :
        trek.price > 1500;
  const elevation = (trek) => Number(trek.maximumElevation ?? trek.elevation ?? 0);
  const elevationMatch = (trek) =>
    answers.elevation === "Any elevation" ? true :
      answers.elevation === "Under 3,500 m" ? elevation(trek) < 3500 :
      answers.elevation === "3,500–4,500 m" ? elevation(trek) >= 3500 && elevation(trek) <= 4500 :
      elevation(trek) > 4500;
  const matches = treks.filter((trek) =>
    dayMatch(trek) &&
    priceMatch(trek) &&
    (answers.region === "Any region" || trek.region === answers.region) &&
    (answers.difficulty === "Any difficulty" || trek.difficulty === answers.difficulty) &&
    elevationMatch(trek),
  );

  return matches
    .map((trek) => ({
      trek,
      reasons: [
        `${trek.duration} days`,
        trek.region,
        trek.difficulty,
        `${elevation(trek).toLocaleString()} m maximum elevation`,
      ],
    }))
    .sort((a, b) => Number(a.trek.price) - Number(b.trek.price));
}

export function FinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { isSaved, isSaving, loading: favoritesLoading, toggleSaved } = useFavorites();
  const notify = useToast();
  const handleSaveTrek = async (trek) => {
    const wasSaved = isSaved(trek.slug);
    try {
      const response = await toggleSaved(trek.slug, trek);
      if (response.requiresAuth) {
        notify("Sign in to save treks to your account.");
        return;
      }
      notify(wasSaved ? "Removed from saved treks" : "Added to your saved treks");
    } catch (error) {
      notify(error.message || "Unable to update saved treks.");
    }
  };
  const regionOptions = useMemo(
    () => [...new Set(treks.map((trek) => trek.region).filter(Boolean))].sort(),
    [treks],
  );
  const difficultyOptions = useMemo(
    () => [...new Set(treks.map((trek) => trek.difficulty).filter(Boolean))].sort(),
    [treks],
  );
  const finderSteps = baseFinderSteps.map((item) => {
    if (item.key === "region") return { ...item, options: ["Any region", ...regionOptions] };
    if (item.key === "difficulty") return { ...item, options: ["Any difficulty", ...difficultyOptions] };
    return item;
  });
  const current = finderSteps[step];

  useEffect(() => {
    let active = true;
    api.treks.getAll({ limit: 100 })
      .then((response) => {
        if (active) setTreks(Array.isArray(response.treks) ? response.treks : []);
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(error.message || "Unable to load trek recommendations.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const chooseAnswer = (value) => setAnswers((previous) => ({ ...previous, [current.key]: value }));
  const reset = () => { setAnswers({}); setStep(0); setResults(null); };
  const handleNext = () => {
    if (!answers[current.key]) return;
    if (step === finderSteps.length - 1) setResults(scoreRecommendations(answers, treks));
    else setStep((previous) => previous + 1);
  };

  if (loading) {
    return <Page className="finder-page"><p className="section-wrap" role="status">Loading published treks…</p></Page>;
  }
  if (loadError) {
    return <Page className="finder-page"><p className="section-wrap" role="alert">{loadError}</p></Page>;
  }
  if (!treks.length) {
    return (
      <Page className="finder-page">
        <section className="finder-shell section-wrap">
          <div className="finder-aside">
            <p className="eyebrow">A thoughtful starting point</p>
            <h1>Find the<br /><em>trail that fits.</em></h1>
            <p>Recommendations will be available when published treks are added to the catalog.</p>
            <Link className="text-link" to="/treks">Browse the trek catalog <ArrowUpRight size={15} /></Link>
          </div>
        </section>
      </Page>
    );
  }

  return (
    <Page className="finder-page">
      <section className="finder-shell section-wrap">
        <div className="finder-aside">
          <p className="eyebrow">A thoughtful starting point</p>
          <h1>Find the<br /><em>trail that fits.</em></h1>
          <p>Eight quick questions. Clear reasons. No mysterious algorithms, and no account needed.</p>
          <div className="finder-aside-note"><Sparkles size={16} /><span>Recommendations use published trek duration, price, region, difficulty, and elevation.</span></div>
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
                {results.length ? "These published journeys match your selected criteria. Here’s what connected." : "No published trek matches every selected criterion. Try relaxing a preference or browse all treks."}
              </p>
              {results.length ? (
                <div className="finder-results-list">
                  {results.map(({ trek, reasons }) => (
                    <article className="finder-result" key={trek.slug}>
                      <Image src={trek.images?.[0] || trek.image} alt={trek.title} />
                      <div><span className="eyebrow">{trek.region} · {trek.duration} days · {trek.currency || "USD"} {Number(trek.price).toLocaleString()}</span><h3><Link to={`/treks/${trek.slug}`}>{trek.title}</Link></h3><p>{reasons.join(" · ")}</p><button className={`finder-save${isSaved(trek.slug) ? " is-saved" : ""}`} type="button" aria-pressed={isSaved(trek.slug)} onClick={() => handleSaveTrek(trek)} disabled={favoritesLoading || isSaving(trek.slug)}><Heart size={13} fill={isSaved(trek.slug) ? "currentColor" : "none"} /> {isSaved(trek.slug) ? "Saved" : "Save this trek"}</button></div>
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
