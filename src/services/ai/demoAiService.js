export async function generateAIDemoReply({ prompt, role = 'admin' }) {
  if (!prompt || !String(prompt).trim()) {
    return {
      ok: false,
      message: 'Debe ingresar una consulta para el asistente.',
    };
  }

  return {
    ok: true,
    provider: 'demo',
    model: 'demo-model',
    role,
    answer:
      'Modo demostración activado. El asistente de IA no está conectado a un proveedor externo. Puede explicar el flujo del sistema, revisar permisos básicos y orientar sobre procedimientos institucionales, pero debe ser validado por personal autorizado antes de tomar decisiones clínicas.',
    timestamp: new Date().toISOString(),
  };
}
