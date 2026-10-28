import { useState } from "react";

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="accordion-wrapper">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`accordion-item ${isOpen ? "open" : ""}`}>
            <button
              type="button"
              className="accordion-header"
              onClick={() => toggleIndex(index)}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <span className="accordion-icon" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && <div className="accordion-body">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
