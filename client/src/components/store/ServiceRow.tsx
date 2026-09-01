type Service = {
  name: string;
  icon: string;
};

type ServiceRowProps = {
  services: Service[];
};

export const ServiceRow = ({ services }: ServiceRowProps) => {
  return (
    <section className="grid grid-cols-4 gap-3 md:grid-cols-8" aria-label="Поддерживаемые сервисы">
      {services.map((service) => (
        <div key={service.name} className="group flex cursor-default flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/80">
          <img src={service.icon} alt="" className="size-10 object-contain transition duration-300 group-hover:scale-110" />
          <span className="text-xs font-semibold text-slate-600 transition group-hover:text-violet-700">{service.name}</span>
        </div>
      ))}
    </section>
  );
};
