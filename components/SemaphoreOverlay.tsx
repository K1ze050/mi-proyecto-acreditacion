interface SemaphoreProps {
    status: 'IDLE' | 'PROCESSING' | 'OK' | 'ALERTA' | 'ERROR';
    onDismiss: () => void;
}

export default function SemaphoreOverlay({ status, onDismiss }: SemaphoreProps) {
  if (status === 'IDLE' || status === 'PROCESSING') return null;

  const config = {
    'OK': {
      color: 'bg-green-600',
      title: 'ACCESO CONCEDIDO',
      subtitle: 'Entregar 1 Ticket Físico',
      icon: '✅'
    },
    'ALERTA': {
      color: 'bg-red-600',
      title: 'DENEGADO / YA INGRESÓ',
      subtitle: 'Derivar a Mesa de Problemas INMEDIATAMENTE',
      icon: '⛔'
    },
    'ERROR': {
      color: 'bg-yellow-500',
      title: 'QR INVÁLIDO O ERROR',
      subtitle: 'Derivar a Mesa de Problemas',
      icon: '⚠️'
    }
  };

  const current = config[status] || config['ERROR'];

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center text-white ${current.color} animate-[pulse_0.5s_ease-in-out] cursor-pointer`}
      onClick={onDismiss}
    >
      <span className="text-8xl mb-4">{current.icon}</span>
      <h1 className="text-5xl font-black text-center px-4">{current.title}</h1>
      <p className="text-2xl mt-6 font-bold text-center px-4 bg-black/30 py-2 rounded-xl">
        {current.subtitle}
      </p>
      <p className="absolute bottom-10 text-lg opacity-80">
        Toca la pantalla para continuar rápido
      </p>
    </div>
  );
}