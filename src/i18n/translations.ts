export type Language = "pt" | "en" | "es";

export const LANGUAGE_LABELS: Record<Language, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
};

const pt = {
  nav: {
    inicio: "INÍCIO",
    aOrion: "A ORION",
    nossaHistoria: "Nossa história",
    qualidade: "Qualidade",
    trabalheConosco: "Trabalhe conosco",
    produtos: "PRODUTOS",
    ondeEncontrar: "ONDE ENCONTRAR",
    contato: "CONTATO",
  },
  hero: {
    title: "Desde 1958, produzindo chocolates finos que fazem parte da história de Blumenau.",
    lead: "Há mais de seis décadas, a Orion transforma tradição, qualidade e paixão em chocolates finos que fazem parte da vida de gerações.",
    ctaProducts: "Conheça nossos produtos",
    ctaContact: "Fale conosco",
  },
  history: {
    title: "Uma história que atravessa gerações.",
    lead: "Tudo começou em 1958. Desde então, a Orion Chocolates constrói uma trajetória marcada pela tradição familiar, inovação e compromisso com a qualidade, tornando-se uma referência em Blumenau e região.",
    cta: "Conheça nossa História completa",
  },
  products: {
    title: "Chocolates finos para todos os momentos.",
    leadLine1: "Compre os chocolates da Orion de forma prática e receba toda a tradição da",
    leadLine2: "nossa marca no conforto da sua casa.",
    ctaProducts: "Conheça nossos produtos",
    ctaShop: "Loja Virtual",
  },
  b2b: {
    title: "Leve a qualidade da Orion para o seu negócio.",
    lead: "Seja para presentear clientes e colaboradores ou para revender nossos chocolates finos, oferecemos condições especiais para compras em maior volume, com atendimento personalizado.",
    cta: "Solicite um orçamento",
  },
  storeLocator: {
    title: "A Tradição da Orion Mais Perto de Você",
    lead: "Há 68 anos, o cheirinho do nosso chocolate marca a história de Blumenau. Encontre o ponto de venda mais próximo ou receba nossa doçura no conforto da sua casa",
    mapCta: "Como chegar",
  },
  stores: {
    itoupavaNorte: "Loja Itoupava Norte",
    centro: "Loja Centro",
  },
  contact: {
    title: "CONTATO",
    leadLine1: "Estamos prontos para atender você.",
    leadLine2: "Entre em contato para esclarecer dúvidas, solicitar informações ou falar com nossa equipe.",
    namePlaceholder: "Nome completo",
    emailPlaceholder: "Endereço de e-mail",
    phonePlaceholder: "Número de telefone",
    messagePlaceholder: "Deixe uma mensagem",
    send: "Enviar",
  },
  faq: {
    eyebrow: "Dúvidas frequentes",
    title: "Perguntas frequentes",
    items: [
      {
        question: "Onde posso encontrar os chocolates Orion?",
        answer:
          "Temos duas lojas físicas em Blumenau — Itoupava Norte e Centro. Você pode ver o endereço exato de cada uma na seção \"Onde encontrar\" logo acima, com um mapa interativo pra escolher a mais próxima de você.",
      },
      {
        question: "Quais sabores de chocolate vocês oferecem?",
        answer:
          "Hoje temos cinco sabores: Passas, Castanhas de Caju, Ao Leite, Meio Amargo e Crocante. Você pode conferir todos eles com mais detalhes na página de Produtos.",
      },
      {
        question: "Vocês vendem para revenda ou em grande quantidade?",
        answer:
          "Sim! Oferecemos condições especiais para presentear clientes e colaboradores ou para revenda, com atendimento personalizado. É só solicitar um orçamento na seção \"Leve a qualidade da Orion para o seu negócio\".",
      },
      {
        question: "Como faço para trabalhar na Orion?",
        answer:
          "Ficamos felizes com o interesse! Visite a página \"Trabalhe conosco\" e envie seu currículo por lá — nossa equipe entra em contato caso surja uma oportunidade compatível.",
      },
      {
        question: "Como entro em contato com a Orion?",
        answer:
          "Você pode preencher o formulário na seção de Contato aqui na página, ou falar diretamente com a gente pelos canais indicados ali. Respondemos o mais rápido possível.",
      },
    ],
  },
  footer: {
    tagline: "Desde 1958, produzindo chocolates finos que fazem parte da história de Blumenau.",
    navTitle: "Navegação",
    aOrionTitle: "A Orion",
    legalTitle: "Legal",
    siteLinks: {
      inicio: "Início",
      produtos: "Produtos",
      ondeEncontrar: "Onde encontrar",
      contato: "Contato",
    },
    legalLinks: {
      privacidade: "Política de Privacidade",
      cookies: "Política de Cookies",
      termos: "Termos de Uso",
    },
    rights: "Todos os direitos reservados.",
    madeBy: "Feito por Sekoia",
  },
  nossaHistoria: {
    eyebrow: "A Orion",
    title: "Nossa história",
    lead: "Desde 1958 transformando tradição, qualidade e paixão em chocolates finos que fazem parte da vida de gerações em Blumenau.",
    milestones: [
      {
        year: "1958",
        title: "O início de uma história de sucesso",
        text: "Fundada por Ewald e Nina Hoeltgebaum, a Orion Chocolates nasceu em Blumenau com o propósito de produzir chocolates de alta qualidade, dando início a uma trajetória marcada pela tradição familiar e pelo compromisso com a excelência.",
      },
      {
        year: "1974",
        title: "A produção ganha um novo espaço",
        text: "A fábrica passou a funcionar no porão do prédio da Rua Marechal Floriano Peixoto, acompanhando o crescimento da empresa e ampliando sua capacidade de produção, sempre preservando a qualidade dos chocolates finos Orion.",
      },
      {
        year: "1978",
        title: "Uma identidade que marcou época",
        text: "A Orion lançou um de seus primeiros catálogos de produtos e adotou sua primeira etiqueta, fortalecendo a identidade da marca e aproximando ainda mais seus chocolates finos dos consumidores.",
      },
      {
        year: "1980",
        title: "Superando desafios",
        text: "A enchente de 1980 marcou um dos momentos mais desafiadores da história da Orion. Mesmo diante das dificuldades, a empresa manteve seu compromisso com a qualidade e deu continuidade à sua trajetória de crescimento.",
      },
      {
        year: "2010",
        title: "Mais próxima dos clientes",
        text: "Com a inauguração da loja no Shopping Neumarkt, a Orion ampliou sua presença em Blumenau, oferecendo um espaço moderno para que ainda mais pessoas pudessem conhecer e apreciar seus chocolates finos.",
      },
    ],
    mvv: [
      { title: "Nossa Missão", text: "Produzir produtos de qualidade." },
      { title: "Nossa Visão", text: "Ser referência local na produção de chocolates finos e produtos relacionados." },
      { title: "Nossos Valores", text: "Comprometimento com resultados. Valorizamos as pessoas e as relações." },
    ],
    ctaText: "Quer conhecer os chocolates que essa história produziu?",
    ctaButton: "Conheça nossos produtos",
    imagePlaceholder: "imagem",
  },
  qualidade: {
    titleLine1: "Qualidade",
    titleLine2: "& Sustentabilidade",
    section1Title: "O cuidado está em cada etapa",
    section1Text:
      "Na Orion, qualidade é um compromisso presente em todo o processo. Da seleção dos ingredientes aos detalhes da produção, cada chocolate é elaborado para oferecer sabor, excelência e uma experiência única.",
    section2Title: "Qualidade também é responsabilidade",
    section2Text:
      "A Orion busca aperfeiçoar continuamente seus processos, adotando práticas que valorizam o uso consciente dos recursos, o respeito às pessoas e a responsabilidade com o meio ambiente.",
    stats: [
      { value: "1958", label: "Ano de fundação" },
      { value: "68", label: "Anos de tradição em Blumenau" },
      { value: "2", label: "Lojas físicas em Blumenau" },
    ],
    ctaText: "Quer experimentar os chocolates que essa qualidade produz?",
    ctaButton: "Conheça nossos produtos",
  },
  trabalheConosco: {
    title: "Trabalhe conosco",
    imgAlt: "Uma das primeiras funcionárias da Orion trabalhando na produção artesanal dos chocolates",
    subtitle: "Faça parte da nossa história.",
    text: "Se você acredita na dedicação, no compromisso com a qualidade e na busca pela excelência, venha construir sua trajetória conosco. Faça parte da equipe Orion e cresça em uma empresa que há mais de seis décadas transforma chocolates finos em momentos especiais.",
    cta: "Envie seu currículo",
    valuesTitle: "Por que trabalhar na Orion?",
    values: [
      { title: "Tradição", text: "Mais de 65 anos construindo uma marca reconhecida em Blumenau e região." },
      { title: "Qualidade", text: "Um time comprometido com a excelência em cada etapa da produção." },
      { title: "Propósito", text: "Ajude a levar momentos especiais através dos nossos chocolates finos." },
    ],
  },
  produtosFlavors: {
    "halloween-fantasma": { name: "FANTASMA", tagline: ["UM SUSTO DE SABOR.", "CHOCOLATE QUE ENCANTA."] as [string, string] },
    "halloween-abobora": { name: "ABÓBORA", tagline: ["DOÇURAS OU TRAVESSURAS?", "ESCOLHA A DOÇURA."] as [string, string] },
    "halloween-trick-or-treat": { name: "TRICK OR TREAT", tagline: ["O LADO DOCE DO HALLOWEEN.", ""] as [string, string] },
  },
};

const en: typeof pt = {
  nav: {
    inicio: "HOME",
    aOrion: "ABOUT ORION",
    nossaHistoria: "Our history",
    qualidade: "Quality",
    trabalheConosco: "Work with us",
    produtos: "PRODUCTS",
    ondeEncontrar: "FIND A STORE",
    contato: "CONTACT",
  },
  hero: {
    title: "Since 1958, crafting fine chocolates that are part of Blumenau's history.",
    lead: "For more than six decades, Orion has turned tradition, quality and passion into fine chocolates that are part of generations' lives.",
    ctaProducts: "Discover our products",
    ctaContact: "Get in touch",
  },
  history: {
    title: "A story that spans generations.",
    lead: "It all began in 1958. Since then, Orion Chocolates has built a journey marked by family tradition, innovation and a commitment to quality, becoming a reference in Blumenau and the surrounding region.",
    cta: "See our full history",
  },
  products: {
    title: "Fine chocolates for every moment.",
    leadLine1: "Buy Orion chocolates the easy way and get all the tradition of",
    leadLine2: "our brand in the comfort of your home.",
    ctaProducts: "Discover our products",
    ctaShop: "Online Store",
  },
  b2b: {
    title: "Bring Orion's quality to your business.",
    lead: "Whether it's gifting clients and employees or reselling our fine chocolates, we offer special conditions for larger orders, with personalized service.",
    cta: "Request a quote",
  },
  storeLocator: {
    title: "Orion's Tradition, Closer to You",
    lead: "For 68 years, the smell of our chocolate has marked Blumenau's history. Find the nearest store or get our sweetness delivered to the comfort of your home",
    mapCta: "Get directions",
  },
  stores: {
    itoupavaNorte: "Itoupava Norte Store",
    centro: "Downtown Store",
  },
  contact: {
    title: "CONTACT",
    leadLine1: "We're ready to help you.",
    leadLine2: "Get in touch to ask questions, request information, or talk to our team.",
    namePlaceholder: "Full name",
    emailPlaceholder: "Email address",
    phonePlaceholder: "Phone number",
    messagePlaceholder: "Leave a message",
    send: "Send",
  },
  faq: {
    eyebrow: "Frequently asked",
    title: "Frequently asked questions",
    items: [
      {
        question: "Where can I find Orion chocolates?",
        answer:
          "We have two physical stores in Blumenau — Itoupava Norte and Downtown. You can see the exact address of each one in the \"Find a store\" section above, with an interactive map to pick whichever is closest to you.",
      },
      {
        question: "What chocolate flavors do you offer?",
        answer:
          "Today we have five flavors: Raisins, Cashews, Milk, Semisweet and Crunchy. You can check them all out in more detail on the Products page.",
      },
      {
        question: "Do you sell for resale or in bulk?",
        answer:
          "Yes! We offer special conditions for gifting clients and employees, or for resale, with personalized service. Just request a quote in the \"Bring Orion's quality to your business\" section.",
      },
      {
        question: "How do I apply to work at Orion?",
        answer:
          "We're glad you're interested! Visit the \"Work with us\" page and send your résumé from there — our team will reach out if a matching opportunity comes up.",
      },
      {
        question: "How do I get in touch with Orion?",
        answer:
          "You can fill out the form in the Contact section on this page, or reach us directly through the channels listed there. We respond as quickly as possible.",
      },
    ],
  },
  footer: {
    tagline: "Since 1958, crafting fine chocolates that are part of Blumenau's history.",
    navTitle: "Navigation",
    aOrionTitle: "About Orion",
    legalTitle: "Legal",
    siteLinks: {
      inicio: "Home",
      produtos: "Products",
      ondeEncontrar: "Find a store",
      contato: "Contact",
    },
    legalLinks: {
      privacidade: "Privacy Policy",
      cookies: "Cookie Policy",
      termos: "Terms of Use",
    },
    rights: "All rights reserved.",
    madeBy: "Made by Sekoia",
  },
  nossaHistoria: {
    eyebrow: "About Orion",
    title: "Our history",
    lead: "Since 1958, turning tradition, quality and passion into fine chocolates that are part of generations' lives in Blumenau.",
    milestones: [
      {
        year: "1958",
        title: "The start of a success story",
        text: "Founded by Ewald and Nina Hoeltgebaum, Orion Chocolates was born in Blumenau with the purpose of producing high-quality chocolates, beginning a journey marked by family tradition and a commitment to excellence.",
      },
      {
        year: "1974",
        title: "Production gets a new home",
        text: "The factory began operating in the basement of the building on Rua Marechal Floriano Peixoto, keeping pace with the company's growth and expanding its production capacity, always preserving the quality of Orion's fine chocolates.",
      },
      {
        year: "1978",
        title: "An identity that made its mark",
        text: "Orion released one of its first product catalogs and adopted its first label, strengthening the brand's identity and bringing its fine chocolates even closer to consumers.",
      },
      {
        year: "1980",
        title: "Overcoming challenges",
        text: "The 1980 flood marked one of the most challenging moments in Orion's history. Even in the face of hardship, the company kept its commitment to quality and continued on its path of growth.",
      },
      {
        year: "2010",
        title: "Closer to customers",
        text: "With the opening of the store at Shopping Neumarkt, Orion expanded its presence in Blumenau, offering a modern space for even more people to discover and enjoy its fine chocolates.",
      },
    ],
    mvv: [
      { title: "Our Mission", text: "To produce quality products." },
      { title: "Our Vision", text: "To be a local reference in the production of fine chocolates and related products." },
      { title: "Our Values", text: "Commitment to results. We value people and relationships." },
    ],
    ctaText: "Want to try the chocolates this story produced?",
    ctaButton: "Discover our products",
    imagePlaceholder: "image",
  },
  qualidade: {
    titleLine1: "Quality",
    titleLine2: "& Sustainability",
    section1Title: "Care goes into every step",
    section1Text:
      "At Orion, quality is a commitment present throughout the entire process. From ingredient selection to production details, every chocolate is crafted to deliver flavor, excellence and a unique experience.",
    section2Title: "Quality is also responsibility",
    section2Text:
      "Orion continuously strives to improve its processes, adopting practices that value the conscious use of resources, respect for people, and responsibility toward the environment.",
    stats: [
      { value: "1958", label: "Year founded" },
      { value: "68", label: "Years of tradition in Blumenau" },
      { value: "2", label: "Physical stores in Blumenau" },
    ],
    ctaText: "Want to try the chocolates this quality produces?",
    ctaButton: "Discover our products",
  },
  trabalheConosco: {
    title: "Work with us",
    imgAlt: "One of Orion's first employees working on the handcrafted production of the chocolates",
    subtitle: "Be part of our history.",
    text: "If you believe in dedication, a commitment to quality and the pursuit of excellence, come build your career with us. Join the Orion team and grow in a company that has turned fine chocolates into special moments for more than six decades.",
    cta: "Send your résumé",
    valuesTitle: "Why work at Orion?",
    values: [
      { title: "Tradition", text: "More than 65 years building a brand recognized across Blumenau and beyond." },
      { title: "Quality", text: "A team committed to excellence at every stage of production." },
      { title: "Purpose", text: "Help bring special moments to people through our fine chocolates." },
    ],
  },
  produtosFlavors: {
    "halloween-fantasma": { name: "FANTASMA", tagline: ["A SHOCKING FLAVOR.", "CHOCOLATE THAT ENCHANTS."] },
    "halloween-abobora": { name: "ABÓBORA", tagline: ["TRICKS OR TREATS?", "CHOOSE YOUR SWEETNESS."] },
    "halloween-trick-or-treat": { name: "TRICK OR TREAT", tagline: ["THE SWEET SIDE OF HALLOWEEN.", ""] },
  },
};

const es: typeof pt = {
  nav: {
    inicio: "INICIO",
    aOrion: "SOBRE ORION",
    nossaHistoria: "Nuestra historia",
    qualidade: "Calidad",
    trabalheConosco: "Trabaja con nosotros",
    produtos: "PRODUCTOS",
    ondeEncontrar: "DÓNDE ENCONTRARNOS",
    contato: "CONTACTO",
  },
  hero: {
    title: "Desde 1958, elaborando chocolates finos que forman parte de la historia de Blumenau.",
    lead: "Desde hace más de seis décadas, Orion convierte tradición, calidad y pasión en chocolates finos que forman parte de la vida de generaciones.",
    ctaProducts: "Conoce nuestros productos",
    ctaContact: "Habla con nosotros",
  },
  history: {
    title: "Una historia que atraviesa generaciones.",
    lead: "Todo comenzó en 1958. Desde entonces, Orion Chocolates construye una trayectoria marcada por la tradición familiar, la innovación y el compromiso con la calidad, convirtiéndose en una referencia en Blumenau y la región.",
    cta: "Conoce nuestra historia completa",
  },
  products: {
    title: "Chocolates finos para todos los momentos.",
    leadLine1: "Compra los chocolates de Orion de forma práctica y recibe toda la tradición de",
    leadLine2: "nuestra marca en la comodidad de tu casa.",
    ctaProducts: "Conoce nuestros productos",
    ctaShop: "Tienda Virtual",
  },
  b2b: {
    title: "Lleva la calidad de Orion a tu negocio.",
    lead: "Ya sea para regalar a clientes y colaboradores o para revender nuestros chocolates finos, ofrecemos condiciones especiales para compras de mayor volumen, con atención personalizada.",
    cta: "Solicita un presupuesto",
  },
  storeLocator: {
    title: "La Tradición de Orion Más Cerca de Ti",
    lead: "Desde hace 68 años, el aroma de nuestro chocolate marca la historia de Blumenau. Encuentra el punto de venta más cercano o recibe nuestra dulzura en la comodidad de tu casa",
    mapCta: "Cómo llegar",
  },
  stores: {
    itoupavaNorte: "Tienda Itoupava Norte",
    centro: "Tienda Centro",
  },
  contact: {
    title: "CONTACTO",
    leadLine1: "Estamos listos para atenderte.",
    leadLine2: "Ponte en contacto para resolver dudas, solicitar información o hablar con nuestro equipo.",
    namePlaceholder: "Nombre completo",
    emailPlaceholder: "Correo electrónico",
    phonePlaceholder: "Número de teléfono",
    messagePlaceholder: "Deja un mensaje",
    send: "Enviar",
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Preguntas frecuentes",
    items: [
      {
        question: "¿Dónde puedo encontrar los chocolates Orion?",
        answer:
          "Tenemos dos tiendas físicas en Blumenau — Itoupava Norte y Centro. Puedes ver la dirección exacta de cada una en la sección \"Dónde encontrarnos\" más arriba, con un mapa interactivo para elegir la más cercana a ti.",
      },
      {
        question: "¿Qué sabores de chocolate ofrecen?",
        answer:
          "Hoy tenemos cinco sabores: Pasas, Anacardos, Con Leche, Semiamargo y Crocante. Puedes ver todos con más detalle en la página de Productos.",
      },
      {
        question: "¿Venden para reventa o en grandes cantidades?",
        answer:
          "¡Sí! Ofrecemos condiciones especiales para regalar a clientes y colaboradores o para reventa, con atención personalizada. Solo tienes que solicitar un presupuesto en la sección \"Lleva la calidad de Orion a tu negocio\".",
      },
      {
        question: "¿Cómo puedo trabajar en Orion?",
        answer:
          "¡Nos alegra tu interés! Visita la página \"Trabaja con nosotros\" y envía tu currículum desde allí — nuestro equipo se pondrá en contacto si surge una oportunidad compatible.",
      },
      {
        question: "¿Cómo me pongo en contacto con Orion?",
        answer:
          "Puedes completar el formulario en la sección de Contacto de esta página, o hablar directamente con nosotros por los canales indicados allí. Respondemos lo antes posible.",
      },
    ],
  },
  footer: {
    tagline: "Desde 1958, elaborando chocolates finos que forman parte de la historia de Blumenau.",
    navTitle: "Navegación",
    aOrionTitle: "Sobre Orion",
    legalTitle: "Legal",
    siteLinks: {
      inicio: "Inicio",
      produtos: "Productos",
      ondeEncontrar: "Dónde encontrarnos",
      contato: "Contacto",
    },
    legalLinks: {
      privacidade: "Política de Privacidad",
      cookies: "Política de Cookies",
      termos: "Términos de Uso",
    },
    rights: "Todos los derechos reservados.",
    madeBy: "Hecho por Sekoia",
  },
  nossaHistoria: {
    eyebrow: "Sobre Orion",
    title: "Nuestra historia",
    lead: "Desde 1958 convirtiendo tradición, calidad y pasión en chocolates finos que forman parte de la vida de generaciones en Blumenau.",
    milestones: [
      {
        year: "1958",
        title: "El comienzo de una historia de éxito",
        text: "Fundada por Ewald y Nina Hoeltgebaum, Orion Chocolates nació en Blumenau con el propósito de producir chocolates de alta calidad, dando inicio a una trayectoria marcada por la tradición familiar y el compromiso con la excelencia.",
      },
      {
        year: "1974",
        title: "La producción gana un nuevo espacio",
        text: "La fábrica comenzó a funcionar en el sótano del edificio de la Rua Marechal Floriano Peixoto, acompañando el crecimiento de la empresa y ampliando su capacidad de producción, preservando siempre la calidad de los chocolates finos Orion.",
      },
      {
        year: "1978",
        title: "Una identidad que marcó época",
        text: "Orion lanzó uno de sus primeros catálogos de productos y adoptó su primera etiqueta, fortaleciendo la identidad de la marca y acercando aún más sus chocolates finos a los consumidores.",
      },
      {
        year: "1980",
        title: "Superando desafíos",
        text: "La inundación de 1980 marcó uno de los momentos más difíciles de la historia de Orion. Incluso ante las dificultades, la empresa mantuvo su compromiso con la calidad y continuó su trayectoria de crecimiento.",
      },
      {
        year: "2010",
        title: "Más cerca de los clientes",
        text: "Con la inauguración de la tienda en el Shopping Neumarkt, Orion amplió su presencia en Blumenau, ofreciendo un espacio moderno para que aún más personas pudieran conocer y disfrutar sus chocolates finos.",
      },
    ],
    mvv: [
      { title: "Nuestra Misión", text: "Producir productos de calidad." },
      { title: "Nuestra Visión", text: "Ser referencia local en la producción de chocolates finos y productos relacionados." },
      { title: "Nuestros Valores", text: "Compromiso con los resultados. Valoramos a las personas y las relaciones." },
    ],
    ctaText: "¿Quieres conocer los chocolates que esta historia produjo?",
    ctaButton: "Conoce nuestros productos",
    imagePlaceholder: "imagen",
  },
  qualidade: {
    titleLine1: "Calidad",
    titleLine2: "y Sostenibilidad",
    section1Title: "El cuidado está en cada etapa",
    section1Text:
      "En Orion, la calidad es un compromiso presente en todo el proceso. Desde la selección de los ingredientes hasta los detalles de la producción, cada chocolate se elabora para ofrecer sabor, excelencia y una experiencia única.",
    section2Title: "La calidad también es responsabilidad",
    section2Text:
      "Orion busca perfeccionar continuamente sus procesos, adoptando prácticas que valoran el uso consciente de los recursos, el respeto a las personas y la responsabilidad con el medio ambiente.",
    stats: [
      { value: "1958", label: "Año de fundación" },
      { value: "68", label: "Años de tradición en Blumenau" },
      { value: "2", label: "Tiendas físicas en Blumenau" },
    ],
    ctaText: "¿Quieres probar los chocolates que produce esta calidad?",
    ctaButton: "Conoce nuestros productos",
  },
  trabalheConosco: {
    title: "Trabaja con nosotros",
    imgAlt: "Una de las primeras empleadas de Orion trabajando en la producción artesanal de los chocolates",
    subtitle: "Sé parte de nuestra historia.",
    text: "Si crees en la dedicación, el compromiso con la calidad y la búsqueda de la excelencia, ven a construir tu trayectoria con nosotros. Forma parte del equipo Orion y crece en una empresa que desde hace más de seis décadas convierte los chocolates finos en momentos especiales.",
    cta: "Envía tu currículum",
    valuesTitle: "¿Por qué trabajar en Orion?",
    values: [
      { title: "Tradición", text: "Más de 65 años construyendo una marca reconocida en Blumenau y la región." },
      { title: "Calidad", text: "Un equipo comprometido con la excelencia en cada etapa de la producción." },
      { title: "Propósito", text: "Ayuda a llevar momentos especiales a través de nuestros chocolates finos." },
    ],
  },
  produtosFlavors: {
    "halloween-fantasma": { name: "FANTASMA", tagline: ["UN SUSTO DE SABOR.", "CHOCOLATE QUE ENCANTA."] },
    "halloween-abobora": { name: "ABÓBORA", tagline: ["¿DULCES O TRUCOS?", "ELIGE LA DULZURA."] },
    "halloween-trick-or-treat": { name: "TRICK OR TREAT", tagline: ["EL LADO DULCE DEL HALLOWEEN.", ""] },
  },
};

export const translations = { pt, en, es };

export type Translations = typeof pt;
