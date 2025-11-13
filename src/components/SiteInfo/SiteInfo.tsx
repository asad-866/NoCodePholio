// components/SiteInfo/SiteInfo.tsx
import React from 'react';
import { FaBolt, FaBrain, FaRocket } from 'react-icons/fa';

const SiteInfo: React.FC = () => {
  return (
    <section className="relative w-full max-w-7xl mx-auto py-24 sm:py-32 px-6 lg:px-8">
      {/* Blurred Wave Effect */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-0 h-[800px] w-[1500px] -translate-x-1/2
          bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
          from-purple-900/20 via-background to-background opacity-70"
        />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl lg:max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What makes this platform unique?
        </h2>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Our generative model understands your inputs to craft a portfolio that
          truly represents your skills and projects.
        </p>
      </div>

      {/* Grid of Features */}
      <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          <div className="flex flex-col p-8 bg-card/50 border border-border rounded-2xl shadow-sm">
            <dt className="flex items-center gap-x-3 text-lg font-semibold text-foreground">
              <FaBrain className="h-6 w-6 text-purple-400" />
              AI-Powered
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7">
              <p className="flex-auto text-muted-foreground">
                Our generative model understands your inputs to craft a portfolio that truly represents you.
              </p>
            </dd>
          </div>

          <div className="flex flex-col p-8 bg-card/50 border border-border rounded-2xl shadow-sm">
            <dt className="flex items-center gap-x-3 text-lg font-semibold text-foreground">
              <FaBolt className="h-6 w-6 text-blue-400" />
              Blazing Fast
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7">
              <p className="flex-auto text-muted-foreground">
                Go from a few simple questions to a fully-deployed professional website in minutes.
              </p>
            </dd>
          </div>

          <div className="flex flex-col p-8 bg-card/50 border border-border rounded-2xl shadow-sm">
            <dt className="flex items-center gap-x-3 text-lg font-semibold text-foreground">
              <FaRocket className="h-6 w-6 text-green-400" />
              Modern Design
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7">
              <p className="flex-auto text-muted-foreground">
                Choose from a library of sleek, professional templates inspired by top-tier tech companies.
              </p>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default SiteInfo;