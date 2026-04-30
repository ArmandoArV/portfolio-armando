import HomeClient from "@/components/HomeClient";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Armando Arredondo Valle",
    url: "https://www.armandoav.com",
    jobTitle: "Software Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Microsoft",
    },
    sameAs: [
      "https://github.com/ArmandoArV",
      "https://www.linkedin.com/in/armando-av",
    ],
    knowsAbout: [
      "React",
      "Azure",
      ".NET",
      "Go",
      "TypeScript",
      "Next.js",
      "AI/ML",
      "Cloud Engineering",
    ],
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Pontificia Universidad Católica de Chile",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Tecnológico de Monterrey",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* SEO-visible content for crawlers */}
      <div className="sr-only">
        <h1>Armando Arredondo Valle — Software Engineer at Microsoft</h1>
        <p>
          Building cloud-native systems, AI solutions &amp; real-time
          applications. Expertise in React, Azure, .NET, Go, TypeScript,
          Next.js, and machine learning.
        </p>
        <p>
          M.Sc. Artificial Intelligence at Pontificia Universidad Católica de
          Chile. B.S. Computer Science at Tecnológico de Monterrey.
        </p>
        <nav>
          <a href="https://github.com/ArmandoArV">GitHub</a>
          <a href="https://www.linkedin.com/in/armando-av">LinkedIn</a>
          <a href="mailto:contact@armandoav.com">Contact</a>
        </nav>
      </div>
      <HomeClient />
    </>
  );
}
