import React from "react";
import Image from "next/image";
import Link from "next/link";
import s from "./Landing.module.css";
import { RECRUITMENT_HREF, domains } from "./data";

export default function DomainGrid() {
	return (
		<section id="domains" className={s.band} aria-labelledby="domains-heading">
			<p className={s.bandKicker}>Domains · pick your lane</p>
			<h2 id="domains-heading" className={s.bandHeading}>
				Three domains, nine tracks. Find where you build best, then come build it with us.
			</h2>
			<div className={`${s.grid} ${s.gridThree}`}>
				{domains.map((domain) => (
					<Link
						key={domain.id}
						href={RECRUITMENT_HREF}
						prefetch={false}
						className={`${s.cell} ${s.cellActive} ${s.domainCell}`}
					>
						<span className={s.kicker}>{domain.kicker}</span>
						<span className={s.domainArt} aria-hidden="true">
							<Image src={domain.image} alt="" fill sizes="88px" />
						</span>
						<div className={s.titleRow}>
							<h3 className={s.title}>{domain.name}</h3>
						</div>
						<p className={s.domainTagline}>{domain.tagline}</p>
						<p className={s.desc}>{domain.about}</p>
						<div className={s.cellFoot}>
							<div className={s.tags}>
								{domain.tags.map((tag) => (
									<span key={tag} className={s.tag}>
										{tag}
									</span>
								))}
							</div>
							<span className={s.arrow} aria-hidden="true">
								→
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
