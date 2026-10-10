import "./Section1.css";

// 10 fashion images: 4 direct URLs + 6 distinct verified reference images
export const GALLERY_ITEMS = [
  {
    id: "item-1",
    imageUrl: "https://i.pinimg.com/736x/7a/73/fc/7a73fc37ed24fbddca60dc16106375d4.jpg",
    alt: "Editorial Fashion Silhouette 01",
  },
  {
    id: "item-2",
    imageUrl: "https://i.pinimg.com/736x/a1/7b/8c/a17b8ca3978cbb30ab43d6deda0672a3.jpg",
    alt: "Editorial Fashion Silhouette 02",
  },
  {
    id: "item-3",
    imageUrl: "https://i.pinimg.com/1200x/e7/b8/f4/e7b8f4c7f49df24eafef7249740930ad.jpg",
    alt: "Editorial Fashion Silhouette 03",
  },
  {
    id: "item-4",
    imageUrl: "https://i.pinimg.com/736x/f2/33/6c/f2336c38ebc85877a5c40813abbffa68.jpg",
    alt: "Editorial Fashion Silhouette 04",
  },
  {
    id: "item-5",
    imageUrl: "https://i.pinimg.com/736x/53/0c/e7/530ce70a891f6948ca1281c9ecdd3007.jpg",
    alt: "Editorial Fashion Silhouette 05",
  },
  {
    id: "item-6",
    imageUrl: "https://i.pinimg.com/736x/61/29/e0/6129e0e38b2142d4c3ba14d929a64a07.jpg",
    alt: "Editorial Fashion Silhouette 06",
  },
  {
    id: "item-7",
    imageUrl: "https://i.pinimg.com/736x/bd/a4/78/bda478b1453998eab2fe1dcb2faa4e9f.jpg",
    alt: "Editorial Fashion Silhouette 07",
  },
  {
    id: "item-8",
    imageUrl: "https://i.pinimg.com/736x/67/d3/c8/67d3c8c4225eadb75b45065c90e6ce34.jpg",
    alt: "Editorial Fashion Silhouette 08",
  },
  {
    id: "item-9",
    imageUrl: "https://i.pinimg.com/736x/77/92/ee/7792eee7070e74337bcd6c3112e3f8a6.jpg",
    alt: "Editorial Fashion Silhouette 09",
  },
  {
    id: "item-10",
    imageUrl: "https://i.pinimg.com/736x/ba/55/8c/ba558cc1bc56d74f94fd9ea1dc7677f5.jpg",
    alt: "Editorial Fashion Silhouette 10",
  },
];

function Section1() {
  return (
    <section
      id="showcase"
      className="showcase showcase--editorial"
      aria-label="Editorial Showcase"
    >
      {/* Editorial Header — strictly only the requested lines */}
      <div className="showcase__header">
        <h2 className="showcase__title">PRECISION DESIRE</h2>
        <span className="showcase__subcaption">THE INSPIRATION &amp; THE MATCH</span>
        <h3 className="showcase__match-headline">You want it? You Got It.</h3>
      </div>

      {/* Continuous One-Direction Infinite Horizontal Editorial Gallery */}
      <div className="showcase__gallery-wrapper">
        <div className="showcase__track" role="region" aria-label="Editorial Image Gallery">
          {/* Primary Sequence */}
          <div className="showcase__set" aria-hidden="false">
            {GALLERY_ITEMS.map((item, index) => (
              <div className="showcase__card" key={`primary-${item.id}`}>
                <div className="showcase__card-img-box">
                  <img
                    src={item.imageUrl}
                    alt={item.alt}
                    className="showcase__card-img"
                    loading={index < 5 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Seamless Duplicate Sequence for Infinite Loop */}
          <div className="showcase__set" aria-hidden="true">
            {GALLERY_ITEMS.map((item, index) => (
              <div className="showcase__card" key={`duplicate-${item.id}`}>
                <div className="showcase__card-img-box">
                  <img
                    src={item.imageUrl}
                    alt={item.alt}
                    className="showcase__card-img"
                    loading={index < 5 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtle Vignette Edge Fades */}
        <div className="showcase__fade showcase__fade--left" aria-hidden="true" />
        <div className="showcase__fade showcase__fade--right" aria-hidden="true" />
      </div>
    </section>
  );
}

export default Section1;
