import Image from "next/image";
import { useTranslations } from "next-intl";
import { Section } from "./Section";

const activityImages = [
  { src: "/activities/my work setup.jpg", title: "My work setup" },

  {
    src: "/activities/natural me and the mirror \u{1F602}.jpg",
    title: "Natural me and the mirror \u{1F602}",
  },
  { src: "/activities/coffee out.jpg", title: "Coffee out" },
];

export function Activities() {
  const t = useTranslations("Activities");

  return (
    <Section title={t("title")}>
      <div className="columns-1 lg:columns-2 gap-4">
        {activityImages.map((activity, index) => (
          <div
            key={index}
            className="group relative mb-4 overflow-hidden rounded-lg border border-border break-inside-avoid"
          >
            <Image
              src={activity.src}
              alt={activity.title}
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-white font-semibold text-lg">
                {activity.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
