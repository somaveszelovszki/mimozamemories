<script lang="ts">
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  export interface HeroImage {
    readonly src: string;
    readonly alt: string;
  }

  export let images: HeroImage[] = [];

  const staticLine = 'Egy szál virág...';
  const dynamicLines: string[] = [
    '...egy emlék',
    '...egy történet',
    '...egy pillanat',
    '...egy mosoly',
    '...egy ünnep',
    '...egy apró csoda',
    '...egy új kezdet',
  ];

  let currentImageIndex = 0;
  let currentTextIndex = 0;
  let localImages: HeroImage[] = [];
  let typedText = dynamicLines[0];

  const imageIntervalMs = 5500;
  const typingSpeedMs = 70;
  const holdTextMs = 1800;

  function startTypingCycle(): void {
    const typeCurrent = (): void => {
      const full = dynamicLines[currentTextIndex] ?? '';
      if (typedText.length < full.length) {
        typedText = full.slice(0, typedText.length + 1);
        setTimeout(typeCurrent, typingSpeedMs);
      } else {
        setTimeout(() => {
          currentTextIndex = (currentTextIndex + 1) % dynamicLines.length;
          typedText = '';
          typeCurrent();
        }, holdTextMs);
      }
    };

    typedText = '';
    typeCurrent();
  }

  onMount(() => {
    if (images.length > 0) {
      // Shallow shuffle for a touch of natural randomness
      const shuffled = [...images];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      localImages = shuffled;
    } else {
      localImages = images;
    }

    const imageInterval = setInterval(() => {
      if (localImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % localImages.length;
      }
    }, imageIntervalMs);

    startTypingCycle();

    return () => {
      clearInterval(imageInterval);
    };
  });
</script>

<section class="hero-root" aria-labelledby="hero-heading">
  <div class="hero-inner">
    <div class="hero-media" aria-hidden="true">
      {#if localImages.length > 0}
        {#each localImages as image, index (image.src)}
          {#if index === currentImageIndex}
            <img
              class="hero-image"
              src={image.src}
              alt={image.alt}
              loading="lazy"
              in:fade={{ duration: 500 }}
              out:fade={{ duration: 500 }}
            />
          {/if}
        {/each}
      {/if}
      <div class="hero-overlay"></div>
    </div>

    <div class="hero-content">
      <p class="hero-kicker">Mimóza Memories</p>
      <h1 id="hero-heading" class="hero-title">
        <span class="hero-line-static">{staticLine}</span>
        <span class="hero-line-dynamic">
          <span>{typedText}</span>
        </span>
      </h1>
      <p class="hero-lead">
        Természetes, mezővirágos esküvői dekorációk és személyre szabott virágkompozíciók, amelyek
        őszintén mesélnek rólatok.
      </p>

      <div class="hero-actions">
        <a href="/wedding" class="hero-button primary">Esküvői inspirációk</a>
        <a href="/contact" class="hero-button ghost">Időpont egyeztetés</a>
      </div>
    </div>
  </div>
</section>

<style>
  .hero-root {
    position: relative;
    width: 100%;
    padding-inline: clamp(1.5rem, 8vw, 4rem);
    padding-top: 4rem;
    padding-bottom: 4rem;
    overflow: hidden;
  }

  .hero-inner {
    position: relative;
    min-height: min(80vh, 720px);
    border-radius: 36px;
    overflow: hidden;
    background-color: #141519;
  }

  .hero-media {
    position: absolute;
    inset: 0;
  }

  .hero-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.04);
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 20%, rgba(246, 237, 223, 0.9), transparent 55%),
      linear-gradient(to right, rgba(17, 24, 39, 0.92), rgba(17, 24, 39, 0.45), rgba(17, 24, 39, 0.8));
    mix-blend-mode: multiply;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    height: 100%;
    max-width: 720px;
    margin-inline: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 3.5rem 3.2rem;
    color: #f9fafb;
  }

  .hero-kicker {
    margin: 0 0 0.75rem;
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(249, 250, 251, 0.75);
  }

  .hero-title {
    margin: 0 0 1.5rem;
    font-size: clamp(2.4rem, 4vw, 3rem);
    line-height: 1.1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .hero-line-static {
    font-weight: 500;
  }

  .hero-line-dynamic {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;
  }

  .hero-line-dynamic span {
    position: relative;
  }

  .hero-line-dynamic span::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    bottom: -0.25rem;
    height: 3px;
    border-radius: 999px;
    background: linear-gradient(to right, #f9e0b7, #e1c190);
  }

  .hero-lead {
    margin: 0 0 2rem;
    font-size: 1rem;
    max-width: 32rem;
    color: rgba(249, 250, 251, 0.8);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
  }

  .hero-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    padding: 0.85rem 1.5rem;
    border-radius: 999px;
    border: 1px solid transparent;
    font-size: 0.9rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    overflow: hidden;
    transform-origin: center;
    transition: transform 130ms ease-out, box-shadow 130ms ease-out, background-color 130ms ease-out,
      border-color 130ms ease-out, color 130ms ease-out;
  }

  .hero-button.primary {
    background: linear-gradient(135deg, #f1d2a5, #c89a62);
    color: #111827;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.36);
  }

  .hero-button.ghost {
    background-color: rgba(17, 24, 39, 0.6);
    border-color: rgba(249, 250, 251, 0.26);
    color: #f9fafb;
  }

  .hero-button::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.55), transparent 60%);
    opacity: 0;
    transform: scale(0.3);
    transition: opacity 220ms ease-out, transform 220ms ease-out;
  }

  .hero-button:hover::before {
    opacity: 1;
    transform: scale(1);
  }

  .hero-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.5);
  }

  @media (max-width: 900px) {
    .hero-inner {
      min-height: 70vh;
      border-radius: 28px;
    }

    .hero-content {
      padding: 2.5rem 2.4rem;
    }
  }

  @media (max-width: 640px) {
    .hero-inner {
      min-height: 520px;
      border-radius: 24px;
    }

    .hero-content {
      padding: 2.1rem 1.8rem 2.4rem;
    }

    .hero-title {
      font-size: 2.1rem;
    }

    .hero-actions {
      flex-direction: column;
      align-items: flex-start;
    }

    .hero-button {
      width: 100%;
      justify-content: center;
    }
  }
</style>

