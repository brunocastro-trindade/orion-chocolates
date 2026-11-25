import { type ComponentType } from "react";
import { Mail, MapPin, MessageSquare, Phone, Send, User } from "lucide-react";
import { STORES } from "@/app/sections/StoreLocator";
import { useLanguage } from "@/i18n/LanguageContext";

export function ContactField({
  icon: Icon,
  placeholder,
  type = "text",
}: {
  icon: ComponentType<{ className?: string }>;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-[#e29647]/70" />
      <input
        type={type}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-[#e29647]/40 bg-[#3d2226] pr-5 pl-14 text-lg text-white placeholder:text-white/50 outline-none transition-colors focus:border-[#e29647]"
        style={{ fontFamily: "'Creato Display', 'DM Sans', sans-serif" }}
      />
    </div>
  );
}

/** Âncora da seção de contato (CTA "Fale conosco" do Hero). */
export const CONTATO_ID = "contato";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="absolute contents">
      <p id={CONTATO_ID} className="[word-break:break-word] absolute leading-[1.1] not-italic text-[#5c3d31] text-[72px] whitespace-nowrap animate-contact" style={{ fontFamily: "'Vesper Nocturne', serif", left: 129, top: 3633 }}>{t.contact.title}</p>
      <div className="[word-break:break-word] absolute leading-[0] not-italic text-[#e09748] text-[24px] animate-contact" style={{ fontFamily: "'Creato Display', 'DM Sans', sans-serif", left: 129, top: 3715, width: 522 }}>
        <p className="leading-[1.1] mb-0 animate-contact">{t.contact.leadLine1}</p>
        <p className="leading-[1.1] animate-contact">{t.contact.leadLine2}</p>
      </div>

      <div className="animate-contact absolute flex flex-col gap-8" style={{ left: 129, top: 3898, width: 522 }}>
        {STORES.map((store) => (
          <div key={store.id} className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#fdf1e3]">
              <MapPin className="h-5 w-5 text-[#e29647]" />
            </div>
            <div style={{ fontFamily: "'Creato Display', 'DM Sans', sans-serif" }}>
              <p className="text-lg font-bold text-[#5c3d31]">{t.stores[store.id]}</p>
              <p className="text-base text-[#6a6a6a]">{store.address}</p>
              {store.hours.map((hours) => (
                <p key={hours} className="text-base text-[#6a6a6a]">{hours}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="animate-contact absolute flex flex-col gap-5 rounded-[28px] bg-[#5c3d31] p-12 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]"
        style={{ left: 651, top: 3633, width: 688, height: 667 }}
      >
        <ContactField icon={User} placeholder={t.contact.namePlaceholder} />
        <ContactField icon={Mail} placeholder={t.contact.emailPlaceholder} type="email" />
        <ContactField icon={Phone} placeholder={t.contact.phonePlaceholder} type="tel" />
        <div className="relative flex-1">
          <MessageSquare className="pointer-events-none absolute top-5 left-5 h-5 w-5 text-[#e29647]/70" />
          <textarea
            placeholder={t.contact.messagePlaceholder}
            className="h-full w-full resize-none rounded-2xl border border-[#e29647]/40 bg-[#3d2226] py-4 pr-5 pl-14 text-lg text-white placeholder:text-white/50 outline-none transition-colors focus:border-[#e29647]"
            style={{ fontFamily: "'Creato Display', 'DM Sans', sans-serif" }}
          />
        </div>
        <button
          type="button"
          className="inline-flex h-14 items-center justify-center gap-2 self-start rounded-2xl bg-[#e29647] px-8 text-lg font-bold text-[#5c3d31] transition-opacity hover:opacity-90"
          style={{ fontFamily: "'Creato Display', 'DM Sans', sans-serif" }}
        >
          {t.contact.send}
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
