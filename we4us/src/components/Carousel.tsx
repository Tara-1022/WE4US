import { useRef } from "react";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";

// https://jcxmpbxll.medium.com/creating-a-carousel-with-horizontal-scrolling-using-react-19efbf67b47d

export default function Carousel(
    { items, scrollBy = 300, classPrefix = "", arrowSize= 40 }: {
        items: React.ReactNode[],
        scrollBy?: number,
        classPrefix?: string,
        arrowSize?: number
    }
) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (amount: number) => scrollRef.current?.scrollBy({
        left: amount,
        behavior: 'smooth'
    });

    return (
        <div className="scroll-carousel-container">

            <div className="scroll-left-arrow">
                <ChevronLeftCircle
                    onClick={() => scroll(-scrollBy)}
                    size={arrowSize}
                />
            </div>

            <div ref={scrollRef}
                className="scroll-carousel">
                {items.map(
                    (item, idx) => <div
                        key={classPrefix + idx}>
                        {item}
                    </div>
                )}
            </div>

            <div className="scroll-right-arrow">
                <ChevronRightCircle 
                    onClick={() => scroll(scrollBy)}
                    size={arrowSize}
                />
            </div>

        </div>
    )
}