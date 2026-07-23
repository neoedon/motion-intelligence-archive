"use client";

import { useEffect, useMemo, useState } from "react";

type Beat = {
  start: number;
  end: number;
  visual: string;
  technique: string;
  purpose: string;
};

type Keyframe = {
  index: number;
  time: number;
  title: string;
  visual: string;
  technique: string;
  purpose: string;
  url: string;
};

type SourceRef = {
  label: string;
  url: string;
};

type OriginalInfo = {
  brand: string;
  year: string;
  projectType: string;
  production: string;
  background: string;
  verification: string;
  sources: SourceRef[];
};

type CaseStudy = {
  order: number;
  slug: string;
  title: string;
  author: string;
  category: string;
  kind: string;
  kindLabel: string;
  duration: number;
  resolution: string;
  fps: string;
  framesScanned: number;
  shotCount: number;
  keyframeCount: number;
  thesis: string;
  story: string;
  beats: Beat[];
  keyframes: Keyframe[];
  motion: string;
  transitions: string;
  color: string;
  type: string;
  sound: string;
  reusable: string[];
  limits: string;
  source: string;
  reference: string;
  credit: string;
  originalInfo: OriginalInfo;
  sheet: string;
};

type ArchiveData = {
  date: string;
  stats: {
    films: number;
    frames: number;
    shots: number;
    keyframes: number;
  };
  records: CaseStudy[];
  trends: { index: string; title: string; body: string }[];
};

const FILTERS = [
  ["ALL", "全部"],
  ["OBJECT", "产品结构"],
  ["TECH", "功能科技"],
  ["PERFORMANCE", "性能证明"],
  ["DESIGN", "品牌设计"],
  ["SENSORY", "感官叙事"],
  ["NARRATIVE", "服务故事"],
] as const;

function timecode(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0",
  )}.${String(millis).padStart(3, "0")}`;
}

function shortDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function Stat({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note: string;
}) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{note}</small>
    </div>
  );
}

function DetailOverlay({
  record,
  onClose,
}: {
  record: CaseStudy;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("detail-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("detail-open");
    };
  }, [onClose]);

  return (
    <div className="detail-backdrop" role="presentation" onMouseDown={onClose}>
      <article
        className="detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="detail-bar">
          <div>
            <span>CASE {String(record.order).padStart(2, "0")}</span>
            <span>{record.kind}</span>
            <span>{shortDuration(record.duration)}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭案例详情">
            CLOSE <b>×</b>
          </button>
        </header>

        <div className="detail-hero">
          <div className="detail-title">
            <p>{record.kindLabel} / DAILY CASE FILE</p>
            <h2 id="detail-title">{record.title}</h2>
            <blockquote>{record.thesis}</blockquote>
            <div className="meta-line">
              <span>{record.author}</span>
              <span>{record.resolution}</span>
              <span>{record.shotCount} SHOTS</span>
              <span>{record.keyframeCount} KEYFRAMES</span>
            </div>
          </div>
          <img
            src={record.sheet}
            alt={`${record.title} 关键画面联系表`}
            className="detail-sheet"
          />
        </div>

        <section className="story-section section-rule">
          <p className="section-kicker">01 / STORY TRANSMISSION</p>
          <div>
            <h3>整条片子的故事传递</h3>
            <p>{record.story}</p>
          </div>
        </section>

        <section className="beats section-rule">
          <div className="section-heading">
            <p className="section-kicker">02 / NARRATIVE RHYTHM</p>
            <h3>镜头与叙事节拍</h3>
          </div>
          <div className="beat-grid">
            {record.beats.map((beat, index) => (
              <article className="beat" key={`${beat.start}-${beat.end}`}>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <time>
                    {timecode(beat.start)}—{timecode(beat.end)}
                  </time>
                </div>
                <h4>{beat.visual}</h4>
                <p>{beat.technique}</p>
                <small>{beat.purpose}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="keyframe-section section-rule">
          <div className="section-heading split-heading">
            <div>
              <p className="section-kicker">03 / KEYFRAME READING</p>
              <h3>关键画面逐张拆解</h3>
            </div>
            <p>
              本片保留 {record.keyframeCount} 张；按叙事与表达需要选择，非固定数量。
            </p>
          </div>
          <div className="keyframe-grid">
            {record.keyframes.map((frame) => (
              <figure className="keyframe" key={frame.index}>
                <div className="frame-image-wrap">
                  <img
                    src={frame.url}
                    loading="lazy"
                    alt={`${record.title} ${frame.title}`}
                  />
                  <span>K{String(frame.index).padStart(2, "0")}</span>
                  <time>{timecode(frame.time)}</time>
                </div>
                <figcaption>
                  <h4>{frame.title}</h4>
                  <dl>
                    <div>
                      <dt>画面</dt>
                      <dd>{frame.visual}</dd>
                    </div>
                    <div>
                      <dt>手法</dt>
                      <dd>{frame.technique}</dd>
                    </div>
                    <div>
                      <dt>作用</dt>
                      <dd>{frame.purpose}</dd>
                    </div>
                  </dl>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="language-section section-rule">
          <div className="section-heading">
            <p className="section-kicker">04 / EXPRESSION SYSTEM</p>
            <h3>表达语言</h3>
          </div>
          <div className="language-grid">
            {[
              ["运动语言", record.motion],
              ["镜头与转场", record.transitions],
              ["色彩与材质", record.color],
              ["排版与信息", record.type],
              ["音画关系", record.sound],
            ].map(([title, body], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h4>{title}</h4>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="reuse-section section-rule">
          <div>
            <p className="section-kicker">05 / EDITOR&apos;S NOTES</p>
            <h3>可复用的方法</h3>
          </div>
          <ol>
            {record.reusable.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <aside>
            <strong>使用边界</strong>
            <p>{record.limits}</p>
          </aside>
        </section>

        <section className="source-file section-rule">
          <div className="source-file-heading">
            <p className="section-kicker">06 / ORIGINAL FILM FILE</p>
            <h3>原片档案</h3>
            <p>
              品牌归属、制作团队与项目出发点。公开资料不足的项目已明确标注，不作推测性归因。
            </p>
          </div>
          <dl className="source-facts">
            <div>
              <dt>品牌 / 项目对象</dt>
              <dd>{record.originalInfo.brand}</dd>
            </div>
            <div>
              <dt>年份</dt>
              <dd>{record.originalInfo.year}</dd>
            </div>
            <div>
              <dt>项目性质</dt>
              <dd>{record.originalInfo.projectType}</dd>
            </div>
            <div className="source-production">
              <dt>制作方 / 主要署名</dt>
              <dd>{record.originalInfo.production}</dd>
            </div>
          </dl>
          <article className="source-background">
            <span>BACKGROUND / BRIEF</span>
            <h4>故事的背景与出发点</h4>
            <p>{record.originalInfo.background}</p>
          </article>
          <aside className="source-verification">
            <strong>资料边界</strong>
            <p>{record.originalInfo.verification}</p>
            <nav aria-label="原片档案资料来源">
              {record.originalInfo.sources.map((source) => (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  key={source.url}
                >
                  {source.label} ↗
                </a>
              ))}
            </nav>
          </aside>
        </section>

        <footer className="detail-footer">
          <p>
            CREDIT<br />
            <span>{record.credit}</span>
          </p>
          <nav aria-label="来源链接">
            <a href={record.source} target="_blank" rel="noreferrer">
              ORIGINAL SOURCE ↗
            </a>
            <a href={record.reference} target="_blank" rel="noreferrer">
              REFERENCE ↗
            </a>
          </nav>
        </footer>
      </article>
    </div>
  );
}

export function MotionArchive() {
  const [data, setData] = useState<ArchiveData | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [activeOrder, setActiveOrder] = useState(1);
  const [detailRecord, setDetailRecord] = useState<CaseStudy | null>(null);

  useEffect(() => {
    fetch("/site-data-20260723-v2.json")
      .then((response) => response.json())
      .then((payload: ArchiveData) => setData(payload));
  }, []);

  const visibleRecords = useMemo(() => {
    if (!data) return [];
    return data.records.filter(
      (record) => filter === "ALL" || record.kind === filter,
    );
  }, [data, filter]);

  const activeRecord =
    data?.records.find((record) => record.order === activeOrder) ??
    visibleRecords[0] ??
    null;

  useEffect(() => {
    if (
      visibleRecords.length &&
      !visibleRecords.some((record) => record.order === activeOrder)
    ) {
      setActiveOrder(visibleRecords[0].order);
    }
  }, [activeOrder, visibleRecords]);

  if (!data || !activeRecord) {
    return (
      <main className="loading">
        <span>MI</span>
        <p>LOADING MOTION ARCHIVE / 正在整理关键帧档案</p>
      </main>
    );
  }

  return (
    <>
      <div className="archive-shell">
        <aside className="side-rail" aria-label="档案编号">
          <span className="monogram">MI</span>
          <p>MOTION INTELLIGENCE ARCHIVE</p>
          <strong>
            {String(activeRecord.order).padStart(2, "0")} /{" "}
            {String(data.stats.films).padStart(2, "0")}
          </strong>
        </aside>

        <header className="topbar">
          <span>DAILY FIELD NOTES № 001</span>
          <time>{data.date.replaceAll("-", " — ")}</time>
          <p>
            DOMESTIC / INTERNATIONAL SELECTION <i /> ARCHIVE READY
          </p>
        </header>

        <main className="main">
          <section className="hero">
            <div className="hero-title">
              <p>PRODUCT MOTION PICTURE INTELLIGENCE</p>
              <h1>
                MOTION <em>INTELLIGENCE</em>
              </h1>
              <h2>产品动态视频每日拆解</h2>
            </div>
            <div className="stats" aria-label="今日统计">
              <Stat
                value={String(data.stats.films)}
                label="FILMS"
                note="今日入档"
              />
              <Stat
                value={data.stats.frames.toLocaleString()}
                label="FRAMES"
                note="逐帧扫描"
              />
              <Stat
                value={String(data.stats.shots)}
                label="SHOTS"
                note="镜头节拍"
              />
              <Stat
                value={String(data.stats.keyframes)}
                label="KEYFRAMES"
                note="表达关键帧"
              />
            </div>
          </section>

          <nav className="filterbar" aria-label="案例筛选">
            <p>Today&apos;s selected case files</p>
            <div>
              {FILTERS.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={filter === value ? "active" : ""}
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                >
                  {value === "ALL" ? `ALL ${data.stats.films}` : label}
                </button>
              ))}
            </div>
          </nav>

          <section className="editorial-workspace">
            <article className="featured">
              <button
                type="button"
                className="featured-image"
                onClick={() => setDetailRecord(activeRecord)}
                aria-label={`打开 ${activeRecord.title} 完整拆解`}
              >
                <img
                  src={activeRecord.sheet}
                  alt={`${activeRecord.title} 关键画面联系表`}
                />
                <span>
                  CASE {String(activeRecord.order).padStart(2, "0")} /{" "}
                  {activeRecord.kindLabel}
                </span>
              </button>
              <div className="featured-caption">
                <div>
                  <p>
                    CASE {String(activeRecord.order).padStart(2, "0")} /{" "}
                    {activeRecord.kind}
                  </p>
                  <h2>{activeRecord.title}</h2>
                  <small>
                    {activeRecord.category} · {activeRecord.resolution} ·{" "}
                    {shortDuration(activeRecord.duration)}
                  </small>
                </div>
                <blockquote>{activeRecord.thesis}</blockquote>
                <button
                  type="button"
                  onClick={() => setDetailRecord(activeRecord)}
                >
                  EXPAND FULL ANALYSIS <b>+</b>
                </button>
              </div>
            </article>

            <aside className="active-analysis">
              <p>
                EXPANDED ANALYSIS / CASE{" "}
                {String(activeRecord.order).padStart(2, "0")}
              </p>
              <h3>{activeRecord.thesis}</h3>
              <div className="mini-timeline">
                {activeRecord.beats.slice(0, 5).map((beat, index) => (
                  <article key={beat.start}>
                    <time>{timecode(beat.start)}</time>
                    <span />
                    <div>
                      <strong>{beat.visual}</strong>
                      <p>{beat.purpose}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="editors-note">
                <span>EDITOR&apos;S NOTE</span>
                <p>{activeRecord.reusable[0]}</p>
              </div>
            </aside>
          </section>

          <section className="case-index" aria-labelledby="case-index-title">
            <div className="index-heading">
              <p>ARCHIVE INDEX / 10 CASE FILES</p>
              <h2 id="case-index-title">今日片单</h2>
            </div>
            <div className="case-grid">
              {visibleRecords.map((record) => (
                <article
                  className={`case-card ${
                    record.order === activeRecord.order ? "selected" : ""
                  }`}
                  key={record.order}
                >
                  <button
                    type="button"
                    className="card-image"
                    onClick={() => setActiveOrder(record.order)}
                    aria-label={`聚焦 ${record.title}`}
                  >
                    <img
                      src={record.sheet}
                      loading="lazy"
                      alt={`${record.title} 联系表`}
                    />
                    <span>{String(record.order).padStart(2, "0")}</span>
                  </button>
                  <div>
                    <p>
                      {record.kind} / {shortDuration(record.duration)}
                    </p>
                    <h3>{record.title}</h3>
                    <blockquote>{record.thesis}</blockquote>
                    <footer>
                      <span>{record.keyframeCount} KEYFRAMES</span>
                      <button
                        type="button"
                        onClick={() => setDetailRecord(record)}
                      >
                        OPEN CASE ↗
                      </button>
                    </footer>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="trends" aria-labelledby="trends-title">
            <div>
              <p>DAILY EDITORIAL OBSERVATIONS</p>
              <h2 id="trends-title">今天值得带走的三条规律</h2>
            </div>
            <div className="trend-grid">
              {data.trends.map((trend) => (
                <article key={trend.index}>
                  <span>{trend.index}</span>
                  <h3>{trend.title}</h3>
                  <p>{trend.body}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <p>
            MOTION INTELLIGENCE<br />
            DAILY PRODUCT FILM ARCHIVE
          </p>
          <nav>
            <a href="#case-index-title">STORIES</a>
            <a href="#trends-title">FINDINGS</a>
            <a
              href="https://www.stashmedia.tv/best-of-stash-2025-product-films/"
              target="_blank"
              rel="noreferrer"
            >
              SOURCES ↗
            </a>
          </nav>
          <strong>001 / DAILY</strong>
        </footer>
      </div>
      {detailRecord ? (
        <DetailOverlay
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
        />
      ) : null}
    </>
  );
}
