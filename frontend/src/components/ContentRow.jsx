import ContentCard from './ContentCard';

export default function ContentRow({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="content-row">
      <h2>{title}</h2>
      <div className="content-row-track">
        {items.map((item) => (
          <ContentCard key={item.id} content={item} />
        ))}
      </div>
    </section>
  );
}
