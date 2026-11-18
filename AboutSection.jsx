const EQUIPE = ['Vinicius Di Tulio Gomes Silva — RM 573019', 'Lucas Zarantonelli Lourenço — RM 569164', 'Felipe Romano de Paula Souza — RM 571653', 'Nicole Barbosa Oliveira de Lima — RM 569505']

export default function AboutSection() {
  return (
    <section aria-labelledby="sobre" className="space-y-3">
      <h2 id="sobre" className="text-xl font-bold">Sobre o Smart Streets</h2>
      <p>Projeto acadêmico da Global Solution 2026.2 (FIAP, Engenharia de Software, 1ESPX), relacionado ao ODS 11. Ajuda passageiros a entender ocorrências simuladas que podem afetar o trajeto e a comparar alternativas cadastradas.</p>
      <p>Limites: os dados são simulados; não há rastreamento ao vivo, pagamento, previsão de acidentes nem cobertura de qualquer endereço. Origens disponíveis: Tatuapé, Itaquera e São Mateus.</p>
      <h3 className="font-semibold">Equipe</h3>
      <ul className="list-disc pl-6">{EQUIPE.map((n) => <li key={n}>{n}</li>)}</ul>
    </section>
  )
}
