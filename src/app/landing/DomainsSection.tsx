"use client";

import React from "react";
import Image from "next/image";

export default function DomainsSection() {
  const domainData = [
    {
      title: "Tech",
      subheading: "We compile Ideas into reality ",
      desc: "From apps to AI, we turn wild ideas into working tech. Less theory, more shipping. If debugging feels like therapy, welcome home.",
      bg: "#FFD4B2", // Peach
      img: "/assets/images/computer.png",
    },
    {
      title: "Design",
      subheading: "We make Tech Look Hot.",
      desc: "We design the wow behind the work, clean UI, smooth UX, and visuals that slap. If pixels spark joy, this is your zone.",
      bg: "#FFB6C1", // Pink
      img: "/assets/images/palette.png",
    },
    {
      title: "Management",
      subheading: "We run the show ",
      desc: "We plan, manage, and make things happen from VinHack to MessIT and everything in between. If you love strategy, people, and execution, you’ll fit right in.",
      bg: "#FFD4B2", // Peach
      img: "/assets/images/glasses.png",
    },
  ];

  return (
    <section className="domains-section" id="domains">
      <h2 className="domains-title font-array">Domains</h2>

      <div className="domains-grid">
        {domainData.map((domain, index) => (
          <div
            key={index}
            className="domain-card"
            style={{ backgroundColor: domain.bg }}
          >
            <h3 className="card-title font-array">{domain.title}</h3>
            <span className="card-subtitle font-khand">{domain.subheading}</span>
            <p className="card-desc font-khand">{domain.desc}</p>
            <div className="card-img-container">
              <Image
                src={domain.img}
                alt={domain.title}
                width={200}
                height={200}
                className="domain-icon"
              />
            </div>
          </div>
        ))}
      </div>


    </section>
  );
}
