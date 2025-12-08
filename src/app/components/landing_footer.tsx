import React from "react";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";

export default function LandingFooter() {
	return (
		<footer className="flex w-full h-[30vh] bg-[#FFFFFF] text-black font-khand">
			<div className="h-full w-[35vw] px-6 flex flex-col justify-around">
				<div className="h-1/2 flex flex-col justify-end items-start w-3/12 text-left text-2xl">
					VinnovateIt
				</div>
				<div className="h-1/2 flex flex-col justify-start items-start w-3/12 text-left py-1">
					<div className="flex items-center gap-4 text-2xl py-1">
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noreferrer"
							aria-label="Instagram"
							className="hover:scale-105 transition-transform"
						>
							<FaInstagram />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noreferrer"
							aria-label="Twitter"
							className="hover:scale-105 transition-transform"
						>
							<FaTwitter />
						</a>
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noreferrer"
							aria-label="Facebook"
							className="hover:scale-105 transition-transform"
						>
							<FaFacebookF />
						</a>
					</div>
				</div>
			</div>
			<div className="h-full w-[65vw] text-2xl flex items-center justify-end px-6">
				<div className="h-full flex flex-col justify-center items-end w-1/2 text-right">
					Join us and be a part of the next big thing on campus
				</div>
			</div>
		</footer>
	);
}
