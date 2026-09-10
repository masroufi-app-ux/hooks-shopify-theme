if (!customElements.get('hooks-product-gallery')) {
  customElements.define(
    'hooks-product-gallery',
    class HooksProductGallery extends HTMLElement {
      connectedCallback() {
        this.slides = Array.from(this.querySelectorAll('[data-gallery-slide]'));
        this.dots = Array.from(this.querySelectorAll('[data-gallery-dot]'));
        this.index = 0;
        this.startX = null;

        this.querySelector('[data-gallery-previous]')?.addEventListener('click', () => this.show(this.index - 1));
        this.querySelector('[data-gallery-next]')?.addEventListener('click', () => this.show(this.index + 1));
        this.dots.forEach((dot) => dot.addEventListener('click', () => this.show(Number(dot.dataset.index))));

        this.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowLeft') this.show(this.index - 1);
          if (event.key === 'ArrowRight') this.show(this.index + 1);
        });

        this.addEventListener('touchstart', (event) => {
          this.startX = event.touches[0]?.clientX ?? null;
        }, { passive: true });

        this.addEventListener('touchend', (event) => {
          if (this.startX === null) return;
          const distance = (event.changedTouches[0]?.clientX ?? this.startX) - this.startX;
          if (Math.abs(distance) > 45) this.show(this.index + (distance < 0 ? 1 : -1));
          this.startX = null;
        }, { passive: true });
      }

      show(nextIndex) {
        if (this.slides.length < 2) return;
        this.index = (nextIndex + this.slides.length) % this.slides.length;
        this.slides.forEach((slide, index) => {
          const active = index === this.index;
          slide.hidden = !active;
          slide.classList.toggle('is-active', active);
        });
        this.dots.forEach((dot, index) => {
          const active = index === this.index;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-current', String(active));
        });
      }
    }
  );
}
