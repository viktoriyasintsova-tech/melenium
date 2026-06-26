import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { products } from "../data/products";
import { formatPrice } from "../utils/formatPrice";

const QUESTIONS = [
  {
    id: "mood",
    title: "Какое настроение тебе ближе?",
    options: [
      {
        id: "cozy",
        label: "Тепло и уют",
        hint: "плед, какао, мягкий свет",
        categories: { sweet: 2, woody: 1 },
      },
      {
        id: "light",
        label: "Свежесть и лёгкость",
        hint: "воздух после дождя, прохлада",
        categories: { fresh: 2 },
      },
      {
        id: "tender",
        label: "Нежность и романтика",
        hint: "цветы, лепестки, объятия",
        categories: { floral: 2 },
      },
      {
        id: "energy",
        label: "Энергия и игра",
        hint: "улыбка, лёгкость, веселье",
        categories: { fruity: 2 },
      },
    ],
  },
  {
    id: "association",
    title: "Что тебе приятнее почувствовать?",
    options: [
      {
        id: "sweet",
        label: "Ваниль, шоколад, карамель",
        hint: "сладко и обволакивающе",
        categories: { sweet: 3 },
      },
      {
        id: "floral",
        label: "Букет цветов: роза, пион, жасмин",
        hint: "как охапка свежих цветов",
        categories: { floral: 3 },
      },
      {
        id: "woody",
        label: "Дерево, дым, ладан",
        hint: "как в старом храме, тепло дерева",
        categories: { woody: 3 },
      },
      {
        id: "fresh",
        label: "Море, цитрус, свежая зелень",
        hint: "прохладно и бодряще",
        categories: { fresh: 3 },
      },
      {
        id: "fruity",
        label: "Сочные ягоды и фрукты",
        hint: "спелые и яркие",
        categories: { fruity: 3 },
      },
    ],
  },
  {
    id: "occasion",
    title: "Для чего подбираешь аромат?",
    options: [
      {
        id: "daily",
        label: "На каждый день",
        hint: "лёгкий и комфортный",
        categories: { fresh: 2, floral: 1 },
      },
      {
        id: "evening",
        label: "Особенный вечер",
        hint: "выразительный и тёплый",
        categories: { sweet: 2, woody: 1 },
      },
      {
        id: "work",
        label: "Работа и встречи",
        hint: "сдержанный и аккуратный",
        categories: { fresh: 1, woody: 1 },
      },
      {
        id: "date",
        label: "Свидание",
        hint: "притягательный и нежный",
        categories: { sweet: 2, floral: 1 },
      },
    ],
  },
  {
    id: "season",
    title: "Любимое время года?",
    options: [
      { id: "winter", label: "Зима", categories: { sweet: 2, woody: 2 } },
      { id: "summer", label: "Лето", categories: { fresh: 2, fruity: 2 } },
      { id: "spring", label: "Весна", categories: { floral: 2, fresh: 1 } },
      { id: "autumn", label: "Осень", categories: { woody: 2, sweet: 1 } },
    ],
  },
  {
    id: "gender",
    title: "Для кого аромат?",
    options: [
      { id: "female", label: "Для неё", gender: "female" },
      { id: "male", label: "Для него", gender: "male" },
      { id: "unisex", label: "Унисекс", gender: "unisex" },
    ],
  },
];

function pickRecommendation(answers) {
  const catWeights = {};
  let gender = null;

  answers.forEach((option) => {
    if (!option) return;
    if (option.categories) {
      Object.entries(option.categories).forEach(([category, weight]) => {
        catWeights[category] = (catWeights[category] || 0) + weight;
      });
    }
    if (option.gender) gender = option.gender;
  });

  const scored = products.map((product) => {
    let score = catWeights[product.category] || 0;
    if (gender) {
      if (product.gender === gender) score += 3;
      else if (product.gender === "unisex" || gender === "unisex") score += 1;
    }
    if (product.image) score += 1;
    if (product.bestseller) score += 0.5;
    return { product, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.score ?? 0;
  const top = scored.filter((item) => item.score >= best - 1).slice(0, 6);
  const choice = top[Math.floor(Math.random() * top.length)] ?? scored[0];
  return choice?.product ?? null;
}

export default function ScentQuiz() {
  const [step, setStep] = useState(0); // 0 — интро, 1..5 — вопросы, 6 — результат
  const [answers, setAnswers] = useState([]);
  const [resultKey, setResultKey] = useState(0);

  const totalQuestions = QUESTIONS.length;
  const isIntro = step === 0;
  const isResult = step > totalQuestions;
  const questionIndex = step - 1;
  const currentQuestion = !isIntro && !isResult ? QUESTIONS[questionIndex] : null;

  const recommendation = useMemo(() => {
    if (!isResult) return null;
    return pickRecommendation(answers);
    // resultKey меняется при «другой вариант», чтобы выбрать заново
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResult, answers, resultKey]);

  const start = () => {
    setAnswers([]);
    setStep(1);
  };

  const choose = (option) => {
    const next = [...answers];
    next[questionIndex] = option;
    setAnswers(next);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const restart = () => {
    setAnswers([]);
    setStep(0);
  };

  return (
    <section
      data-header-tone="dark"
      className="site-section-divider-light bg-[#140f0b] text-white"
    >
      <div className="site-container site-section-y">
        <div className="grid gap-9 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <ScrollReveal>
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
              Подбор аромата
            </p>
            <h2 className="mt-3 font-denistina text-[40px] leading-[0.92] sm:text-[52px] lg:text-[64px]">
              Какой аромат
              <br />
              тебе подходит
            </h2>
            <p className="mt-5 max-w-[420px] font-sans text-[14px] leading-[1.6] text-white/70 sm:text-[15px] lg:text-[16px]">
              Маленькая игра из пяти вопросов про настроение и ассоциации.
              В конце мы подберём аромат из коллекции Millennium — а вы решите,
              влюбиться в него или попробовать другой.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="rounded-[24px] border border-white/12 bg-white/[0.04] p-6 backdrop-blur-[2px] sm:p-8 lg:p-9">
              {isIntro && (
                <div className="flex flex-col items-start">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3ede5] text-[#1c1c1c]">
                    <Wand2 className="h-6 w-6" strokeWidth={1.7} />
                  </span>
                  <p className="mt-5 font-sans text-[15px] leading-[1.6] text-white/75 sm:text-[16px]">
                    Отвечайте интуитивно — здесь нет правильных ответов.
                    Ориентируйтесь на образы и ощущения, которые вам ближе.
                  </p>
                  <button
                    type="button"
                    onClick={start}
                    className="site-btn-light mt-7 w-full gap-2 sm:w-auto sm:min-w-[260px]"
                  >
                    <Sparkles className="h-4 w-4 shrink-0" strokeWidth={1.9} />
                    Начать подбор
                  </button>
                </div>
              )}

              {currentQuestion && (
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-white/45">
                      Вопрос {step} из {totalQuestions}
                    </span>
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-1.5 font-sans text-[13px] text-white/55 site-motion hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
                        Назад
                      </button>
                    )}
                  </div>

                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#f3ede5] site-motion"
                      style={{ width: `${(step / totalQuestions) * 100}%` }}
                    />
                  </div>

                  <h3 className="mt-6 font-sans text-[22px] font-medium leading-[1.2] sm:text-[26px]">
                    {currentQuestion.title}
                  </h3>

                  <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {currentQuestion.options.map((option) => {
                      const active = answers[questionIndex]?.id === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => choose(option)}
                          className={`rounded-[14px] border px-4 py-3.5 text-left site-motion ${
                            active
                              ? "border-[#f3ede5] bg-[#f3ede5] text-[#1c1c1c]"
                              : "border-white/15 bg-white/[0.04] text-white hover:border-white/35 hover:bg-white/[0.08]"
                          }`}
                        >
                          <span className="block font-sans text-[15px] font-medium">
                            {option.label}
                          </span>
                          {option.hint && (
                            <span
                              className={`mt-0.5 block font-sans text-[12px] leading-[1.4] ${
                                active ? "text-[#1c1c1c]/55" : "text-white/45"
                              }`}
                            >
                              {option.hint}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isResult && recommendation && (
                <div>
                  <p className="font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-white/45">
                    Твой аромат
                  </p>

                  <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex h-[180px] w-full shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-[#faf8f4] sm:h-[200px] sm:w-[170px]">
                      {recommendation.image ? (
                        <img
                          src={recommendation.image}
                          alt={recommendation.fullName}
                          className="h-full w-auto object-contain"
                        />
                      ) : (
                        <span className="font-denistina text-[34px] text-[#1c1c1c]/30">
                          Millennium
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
                        {recommendation.categoryLabel}
                      </span>
                      <h3 className="mt-2 font-sans text-[22px] font-semibold leading-[1.15] sm:text-[26px]">
                        {recommendation.name}
                      </h3>
                      {recommendation.brand && (
                        <p className="mt-1 font-sans text-[14px] text-white/55">
                          {recommendation.brand}
                        </p>
                      )}
                      {recommendation.tagline && (
                        <p className="mt-3 font-sans text-[14px] leading-[1.55] text-white/70">
                          {recommendation.tagline}
                        </p>
                      )}
                      <p className="mt-3 font-sans text-[15px] font-semibold">
                        от {formatPrice(recommendation.minPrice)} ₽
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                    <Link
                      to={`/catalog/${recommendation.slug}`}
                      className="site-btn-light w-full gap-2"
                    >
                      Смотреть аромат
                    </Link>
                    <button
                      type="button"
                      onClick={() => setResultKey((k) => k + 1)}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/30 px-6 font-sans text-[14px] font-medium text-white site-motion hover:bg-white/10"
                    >
                      <Sparkles className="h-4 w-4 shrink-0" strokeWidth={1.9} />
                      Другой вариант
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={restart}
                    className="mt-5 inline-flex items-center gap-1.5 font-sans text-[13px] text-white/55 site-motion hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" strokeWidth={1.8} />
                    Пройти заново
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
