"use client";

import React from "react";
import Image from "next/image";

export default function DomainsSection() {
  const domainData = [
    {
      title: "Tech",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      bg: "#FFD4B2", // Peach
      img: "/assets/images/computer.png",
    },
    {
      title: "Design",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      bg: "#FFB6C1", // Pink
      img: "/assets/images/palette.png",
    },
    {
      title: "Management",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
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
