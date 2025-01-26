export class GenerationController {
  constructor() {
    this.controller = null;
    this.cancelButton = document.getElementById('cancelButton');
    this.setupCancelButton();
  }

  setupCancelButton() {
    this.cancelButton.addEventListener('click', () => this.cancel());
  }

  startGeneration() {
    this.controller = new AbortController();
    this.cancelButton.classList.remove('hidden');
    return this.controller.signal;
  }

  cancel() {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
    this.cancelButton.classList.add('hidden');
  }

  endGeneration() {
    this.controller = null;
    this.cancelButton.classList.add('hidden');
  }
}