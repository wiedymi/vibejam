import type { FC } from "react";
import { useRef } from "react";
import { playSound } from "../../utils/sound";

interface MenuProps {
  selectedItem: number;
  setSelectedItem: (index: number) => void;
  menuItems: string[];
}

const Menu: FC<MenuProps> = ({ selectedItem, setSelectedItem, menuItems }) => {
  const prevSelectedRef = useRef(selectedItem);

  const handleClick = (index: number) => {
    playSound("click");
    setSelectedItem(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      playSound("select");
      setSelectedItem(index);
    }
  };

  // Play sound when selection changes
  if (prevSelectedRef.current !== selectedItem) {
    playSound("hover");
    prevSelectedRef.current = selectedItem;
  }

  return (
    <div className="ff-menu-box">
      <div className="ff-menu-title">
        <span className="ff-title-decoration">◆</span> MENU{" "}
        <span className="ff-title-decoration">◆</span>
      </div>
      <div className="ff-menu-items">
        {menuItems.map((text, index) => {
          const isSelected = selectedItem === index;

          return (
            <div
              key={index}
              className={`ff-menu-item ${isSelected ? "ff-menu-selected" : ""}`}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onMouseEnter={() => !isSelected && playSound("hover", 0.3)}
              tabIndex={0}
              aria-label={`Menu item ${text}`}
              aria-selected={isSelected}
            >
              {isSelected && (
                <span className="ff-cursor">
                  <span className="ff-cursor-inner">▶</span>
                </span>
              )}
              <span className="ff-menu-text">{text}</span>
              {isSelected && <span className="ff-menu-highlight"></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
