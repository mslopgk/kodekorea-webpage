'use client';

import { Nav } from './Nav';
import { PixelIris } from './PixelIris';
import { Hero } from './Hero';
import { Intro } from './Intro';
import { Solutions } from './Solutions';
import { Work } from './Work';
import { Capability } from './Capability';
import { Clients } from './Clients';
import { Domains } from './Domains';
import { Contact } from './Contact';
import s from './sentra.module.css';

export default function Sentra() {
  return (
    <div className={s.root}>
      <PixelIris />
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Solutions />
        <Work />
        <Capability />
        <Clients />
        <Domains />
        <Contact />
      </main>
    </div>
  );
}
