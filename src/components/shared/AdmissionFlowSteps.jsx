"use client";
import React, { useEffect, useState } from 'react';
export const AdmissionFlowSteps = ({ steps }) => {
    const [visibleSteps, setVisibleSteps] = useState([]);
    useEffect(() => {
        setVisibleSteps([]);
        const stepNodes = Array.from(document.querySelectorAll('.admission-flow-step'));
        if (!stepNodes.length)
            return;
        if (!('IntersectionObserver' in window)) {
            setVisibleSteps(stepNodes.map((_, index) => index));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const index = Number(entry.target.dataset.stepIndex ?? 0);
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setVisibleSteps((prev) => (prev.includes(index) ? prev : [...prev, index]));
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.35 });
        stepNodes.forEach((node) => observer.observe(node));
        return () => observer.disconnect();
    }, [steps.length]);
    return (<>
      <style>{`
        .admission-flow-step {
          --admission-badge-w: 78px;
          display: grid;
          grid-template-columns: calc(var(--admission-badge-w) + 18px) minmax(0, 1fr);
          gap: 0.625rem;
        }
        .admission-flow-left {
          display: flex;
          flex-direction: column;
        }
        .admission-flow-badge {
          position: relative;
          width: var(--admission-badge-w);
          height: 34px;
          display: grid;
          place-items: center;
          background: #0b2540;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          clip-path: polygon(0 0, 84% 0, 100% 50%, 84% 100%, 0 100%);
          letter-spacing: 0.02em;
        }
        .admission-flow-badge span {
          padding-right: 6px;
        }
        .admission-flow-conn {
          flex: 1;
          min-height: 42px;
          padding-right: 8px;
          margin-bottom: 4px;
          width: var(--admission-badge-w);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          opacity: 0;
        }
        .admission-flow-conn i {
          display: block;
          width: 9px;
          height: 9px;
          border-right: 2.5px solid #115eaf;
          border-bottom: 2.5px solid #115eaf;
          transform: rotate(45deg);
          opacity: 0.22;
        }
        .admission-flow-step:last-child .admission-flow-conn {
          display: none;
        }
        .admission-flow-body {
          padding: 2px 0 26px;
          opacity: 0;
          transform: translateY(14px);
        }
        .admission-flow-step.is-visible .admission-flow-badge {
          clip-path: polygon(0 0, 84% 0, 100% 50%, 84% 100%, 0 100%);
          transition: clip-path 0.3s cubic-bezier(0.2, 0.9, 0.25, 1);
        }
        .admission-flow-step.is-visible .admission-flow-body {
          opacity: 1;
          transform: none;
          transition: opacity 0.3s ease 0.1s, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s;
        }
        .admission-flow-step.is-visible .admission-flow-conn {
          opacity: 1;
          transition: opacity 0.3s ease 0.35s;
        }
        .admission-flow-step.is-visible .admission-flow-conn i {
          animation: admission-wave 0.9s ease-in-out infinite;
        }
        .admission-flow-step.is-visible .admission-flow-conn i:nth-child(2) {
          animation-delay: 0.15s;
        }
        .admission-flow-step.is-visible .admission-flow-conn i:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes admission-wave {
          0%, 100% {
            opacity: 0.2;
            transform: rotate(45deg) translate(0, 0);
          }
          45% {
            opacity: 1;
            transform: rotate(45deg) translate(2px, 2px);
          }
        }
        @media (max-width: 640px) {
          .admission-flow-step {
            --admission-badge-w: 66px;
            gap: 0.5rem;
          }
          .admission-flow-badge {
            height: 30px;
            font-size: 11px;
          }
          .admission-flow-body h3 {
            font-size: 16px;
          }
          .admission-flow-body p {
            font-size: 14px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .admission-flow-body,
          .admission-flow-conn,
          .admission-flow-badge {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .admission-flow-step.is-visible .admission-flow-conn i {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mt-[18px] flex flex-col gap-3">
        {steps.map((step, i) => {
            const stepNo = String(i + 1).padStart(2, '0');
            const isVisible = visibleSteps.includes(i);
            return (<div key={i} data-step-index={i} className={`admission-flow-step ${isVisible ? 'is-visible' : ''}`}>
              <div className="admission-flow-left">
                <div className="admission-flow-badge">
                  <span>Step {stepNo}</span>
                </div>
                <div className="admission-flow-conn" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
              </div>

              <div className="admission-flow-body">
                <h3 className="mb-1 text-[18px] font-semibold leading-[1.35] text-[#000f22] font-sans">
                  {step.title}
                </h3>
                <p className="m-0 text-[15px] leading-[1.55] text-[#43474d] font-normal">
                  {step.description}
                </p>
              </div>
            </div>);
        })}
      </div>
    </>);
};
