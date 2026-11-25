import NavigationMenu4 from "@/app/components/ui/navigation-menu-4";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useNavScale } from "@/app/hooks/useNavScale";

// Navbar no tamanho certo para a tela: no desktop, o quadro de 1440px escalado
// junto com o resto do site; no celular, em largura real (menu hambúrguer).
export default function NavBarFrame() {
  const isMobile = useIsMobile();
  const scale = useNavScale();

  if (isMobile) return <NavigationMenu4 />;
  return (
    <div style={{ width: 1440, transform: `scale(${scale})`, transformOrigin: "top left" }}>
      <NavigationMenu4 />
    </div>
  );
}
