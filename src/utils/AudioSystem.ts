export class AudioSystem {
  private static instance: AudioSystem | null = null;
  private ctx: AudioContext | null = null;
  private musicNodes: AudioScheduledSourceNode[] = [];
  private musicPlaying = false;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private musicScheduleTimer: ReturnType<typeof setTimeout> | null = null;
  private musicStartTime = 0;
  private loopLength = 0;

  static getInstance(): AudioSystem {
    if (!AudioSystem.instance) {
      AudioSystem.instance = new AudioSystem();
    }
    return AudioSystem.instance;
  }

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { /* ignore */ });
    }
    return this.ctx;
  }

  private createOscillator(
    type: OscillatorType,
    freq: number,
    startTime: number,
    duration: number,
    gainVal: number,
    freqEnd?: number,
    dest?: AudioNode
  ): void {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (freqEnd !== undefined) {
      osc.frequency.linearRampToValueAtTime(freqEnd, startTime + duration);
    }

    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(dest ?? this.masterGain ?? ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
    if (dest) this.musicNodes.push(osc);
  }

  playJump(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    this.createOscillator('square', 220, t, 0.1, 0.3, 440);
  }

  playStomp(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    this.createOscillator('square', 150, t, 0.05, 0.4, 50);
    this.createOscillator('sine', 80, t, 0.08, 0.3);
  }

  playDamage(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    this.createOscillator('square', 440, t, 0.15, 0.4, 110);
    this.createOscillator('sawtooth', 220, t + 0.1, 0.2, 0.3, 55);
  }

  playPowerUp(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const notes = [261.63, 329.63, 392, 523.25]; // C4 E4 G4 C5
    notes.forEach((freq, i) => {
      this.createOscillator('square', freq, t + i * 0.05, 0.08, 0.4);
    });
  }

  playDocCollect(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    this.createOscillator('sine', 880, t, 0.05, 0.3);
    this.createOscillator('sine', 1320, t + 0.02, 0.04, 0.2);
  }

  playLevelClear(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const notes = [261.63, 329.63, 392, 523.25, 659.25]; // C E G C5 E5
    notes.forEach((freq, i) => {
      this.createOscillator('square', freq, t + i * 0.15, 0.2, 0.5);
      this.createOscillator('sine', freq * 2, t + i * 0.15, 0.15, 0.2);
    });
  }

  play17Alarm(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      this.createOscillator('square', 880, t + i * 0.3, 0.2, 0.5);
      this.createOscillator('square', 660, t + i * 0.3 + 0.1, 0.15, 0.3);
    }
  }

  playEnemyDie(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    this.createOscillator('square', 400, t, 0.05, 0.4, 200);
    this.createOscillator('square', 200, t + 0.05, 0.08, 0.3, 100);
  }

  playCheckpoint(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const notes = [392, 523.25, 659.25];
    notes.forEach((freq, i) => {
      this.createOscillator('sine', freq, t + i * 0.1, 0.15, 0.4);
    });
  }

  playCombo(multiplier: number): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const baseFreq = 440 + multiplier * 80;
    this.createOscillator('square', baseFreq, t, 0.06, 0.5, baseFreq * 1.5);
    this.createOscillator('sine', baseFreq * 2, t + 0.04, 0.05, 0.3);
  }

  playBossHit(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    this.createOscillator('sawtooth', 200, t, 0.08, 0.5, 100);
    this.createOscillator('square', 400, t, 0.06, 0.4, 200);
  }

  playBossShoot(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    this.createOscillator('sawtooth', 600, t, 0.05, 0.3, 300);
  }

  playBossDie(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const notes = [880, 660, 440, 330, 220, 110];
    notes.forEach((freq, i) => {
      this.createOscillator('square', freq, t + i * 0.1, 0.15, 0.5);
      this.createOscillator('sawtooth', freq * 0.5, t + i * 0.1, 0.12, 0.3);
    });
  }

  playShopBuy(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      this.createOscillator('sine', freq, t + i * 0.07, 0.1, 0.4);
    });
  }

  playLevelTransition(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    this.createOscillator('square', 261.63, t, 0.1, 0.4);
    this.createOscillator('square', 392, t + 0.1, 0.1, 0.4);
    this.createOscillator('square', 523.25, t + 0.2, 0.2, 0.5);
  }

  playVpnEnter(): void {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    this.createOscillator('sawtooth', 200, t, 0.1, 0.3, 400);
    this.createOscillator('sine', 600, t + 0.05, 0.1, 0.2, 300);
  }

  startMusic(): void {
    if (this.musicPlaying) return;
    this.musicPlaying = true;
    this.scheduleMusic();
  }

  private scheduleMusic(): void {
    if (!this.musicPlaying) return;
    const ctx = this.getContext();
    const t = ctx.currentTime + 0.05;

    // All music routes through its own gain node so stopMusic() can cut the
    // already-scheduled loop instantly instead of letting it ring out.
    if (!this.musicGain) {
      this.musicGain = ctx.createGain();
      this.musicGain.connect(this.masterGain ?? ctx.destination);
    }
    const music = this.musicGain;
    this.musicNodes = [];

    const BPM = 140;
    const beat = 60 / BPM;
    const bar = beat * 4;
    const totalBars = 8;
    const loopDuration = bar * totalBars;
    this.loopLength = loopDuration;
    this.musicStartTime = t;

    // Bass line pattern (2 bars repeating)
    const bassNotes = [
      { freq: 110, time: 0, dur: beat * 0.8 },
      { freq: 110, time: beat, dur: beat * 0.3 },
      { freq: 130.81, time: beat * 1.5, dur: beat * 0.5 },
      { freq: 110, time: beat * 2, dur: beat * 0.8 },
      { freq: 98, time: beat * 3, dur: beat * 0.8 },
      { freq: 110, time: bar, dur: beat * 0.8 },
      { freq: 123.47, time: bar + beat, dur: beat * 0.8 },
      { freq: 130.81, time: bar + beat * 2, dur: beat * 0.5 },
      { freq: 110, time: bar + beat * 2.5, dur: beat * 0.3 },
      { freq: 98, time: bar + beat * 3, dur: beat * 0.8 }
    ];

    // Melody (4 bars)
    const melodyNotes = [
      { freq: 440, time: 0, dur: beat * 0.5 },
      { freq: 392, time: beat * 0.5, dur: beat * 0.25 },
      { freq: 440, time: beat * 0.75, dur: beat * 0.25 },
      { freq: 523.25, time: beat * 1, dur: beat * 0.75 },
      { freq: 440, time: beat * 2, dur: beat * 0.5 },
      { freq: 392, time: beat * 2.5, dur: beat * 0.5 },
      { freq: 349.23, time: beat * 3, dur: beat * 1 },
      { freq: 392, time: bar + 0, dur: beat * 0.5 },
      { freq: 440, time: bar + beat * 0.5, dur: beat * 0.25 },
      { freq: 523.25, time: bar + beat * 0.75, dur: beat * 0.25 },
      { freq: 587.33, time: bar + beat * 1, dur: beat * 0.75 },
      { freq: 523.25, time: bar + beat * 2, dur: beat * 0.5 },
      { freq: 440, time: bar + beat * 2.5, dur: beat * 0.5 },
      { freq: 392, time: bar + beat * 3, dur: beat * 0.5 },
      { freq: 349.23, time: bar + beat * 3.5, dur: beat * 0.5 },
      { freq: 329.63, time: bar * 2 + 0, dur: beat * 0.5 },
      { freq: 349.23, time: bar * 2 + beat * 0.5, dur: beat * 0.5 },
      { freq: 392, time: bar * 2 + beat * 1, dur: beat * 0.5 },
      { freq: 440, time: bar * 2 + beat * 1.5, dur: beat * 0.5 },
      { freq: 523.25, time: bar * 2 + beat * 2, dur: beat * 0.75 },
      { freq: 587.33, time: bar * 2 + beat * 3, dur: beat * 1 },
      { freq: 523.25, time: bar * 3 + 0, dur: beat * 0.5 },
      { freq: 440, time: bar * 3 + beat * 0.5, dur: beat * 0.5 },
      { freq: 392, time: bar * 3 + beat * 1, dur: beat * 0.5 },
      { freq: 349.23, time: bar * 3 + beat * 1.5, dur: beat * 0.5 },
      { freq: 329.63, time: bar * 3 + beat * 2, dur: beat * 0.5 },
      { freq: 293.66, time: bar * 3 + beat * 2.5, dur: beat * 0.5 },
      { freq: 261.63, time: bar * 3 + beat * 3, dur: beat * 1 }
    ];

    // Arpeggio/chord stabs
    const chordTimes = [bar * 4, bar * 4 + beat * 2, bar * 5, bar * 5 + beat * 2,
                        bar * 6, bar * 6 + beat * 2, bar * 7, bar * 7 + beat * 2];
    const chordFreqs = [
      [261.63, 329.63, 392],
      [293.66, 369.99, 440],
      [329.63, 415.30, 523.25],
      [261.63, 329.63, 392],
      [261.63, 349.23, 440],
      [293.66, 392, 493.88],
      [329.63, 415.30, 523.25],
      [261.63, 329.63, 392]
    ];

    // Schedule bass (repeats every 2 bars for 8 bars)
    for (let rep = 0; rep < 4; rep++) {
      bassNotes.forEach(note => {
        this.createOscillator('sawtooth', note.freq, t + rep * bar * 2 + note.time, note.dur, 0.25, undefined, music);
      });
    }

    // Schedule melody (4 bars, repeat twice)
    for (let rep = 0; rep < 2; rep++) {
      melodyNotes.forEach(note => {
        this.createOscillator('square', note.freq, t + rep * bar * 4 + note.time, note.dur, 0.15, undefined, music);
      });
    }

    // Schedule chords
    chordTimes.forEach((time, i) => {
      const freqs = chordFreqs[i % chordFreqs.length];
      freqs.forEach(freq => {
        this.createOscillator('square', freq, t + time, beat * 0.4, 0.08, undefined, music);
      });
    });

    // Hi-hat pattern — one shared decaying-noise buffer for every tick
    if (!this.noiseBuffer) {
      const bufferSize = Math.floor(ctx.sampleRate * 0.03);
      this.noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Math.random() * 2 - 1) * (1 - j / bufferSize);
      }
    }
    for (let i = 0; i < totalBars * 4; i++) {
      const hihatTime = t + i * beat * 0.5;
      const source = ctx.createBufferSource();
      source.buffer = this.noiseBuffer;
      const hiGain = ctx.createGain();
      hiGain.gain.setValueAtTime(i % 2 === 0 ? 0.12 : 0.06, hihatTime);
      hiGain.gain.exponentialRampToValueAtTime(0.001, hihatTime + 0.03);
      source.connect(hiGain);
      hiGain.connect(music);
      source.start(hihatTime);
      source.stop(hihatTime + 0.04);
      this.musicNodes.push(source);
    }

    // Kick drum pattern
    for (let bar2 = 0; bar2 < totalBars; bar2++) {
      const kickBeats = [0, 2];
      kickBeats.forEach(b => {
        const kickTime = t + bar2 * bar + b * beat;
        this.createOscillator('sine', 80, kickTime, 0.15, 0.5, 20, music);
      });
    }

    // Schedule next loop
    this.musicScheduleTimer = setTimeout(() => {
      if (this.musicPlaying) {
        this.scheduleMusic();
      }
    }, (loopDuration - 0.5) * 1000);
  }

  isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  stopMusic(): void {
    this.musicPlaying = false;
    if (this.musicScheduleTimer !== null) {
      clearTimeout(this.musicScheduleTimer);
      this.musicScheduleTimer = null;
    }
    // Silence everything already scheduled for the current loop.
    if (this.musicGain) {
      this.musicGain.disconnect();
      this.musicGain = null;
    }
    for (const node of this.musicNodes) {
      try { node.stop(); } catch { /* already stopped */ }
    }
    this.musicNodes = [];
  }

  setVolume(vol: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, vol));
    }
  }
}
