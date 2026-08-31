import cdn from '@/lib/cdn';

export type MeetPerson = 'maarten' | 'merel';

export interface MeetPanelData {
  name: string;
  variant: 'fysio' | 'leefstijl';
  hero: { src: string; alt: string; objectPosition: string };
  about: string[];
  photos: { src: string; alt: string }[];
  steps: { title: string; text: string }[];
  credentials: { year: string; text: string }[];
}

export const meetPanelData: Record<MeetPerson, MeetPanelData> = {
  maarten: {
    name: 'Maarten',
    variant: 'fysio',
    hero: {
      src: `${cdn}/maarten-sled.webp`,
      alt: 'Maarten fysiotherapeut bij MAE Coaching en Fysiotherapie',
      objectPosition: 'center 30%',
    },
    about: [
      'Mijn naam is Maarten en ik ben een enthousiast krachtsporter, fysiotherapeut en personal coach. Van jongs af aan heb ik altijd veel moeite gehad met stilzitten, zoekend naar nieuwe uitdagingen en gefascineerd door de kracht en mogelijkheden van het menselijk lichaam. Deze fascinatie heeft zich ontwikkeld tot een diepe passie voor krachtsport, die de basis vormt voor mijn professionele leven.',
      'Mijn aanpak gaat verder dan het standaard behandelprotocol; ik streef ernaar om een plan te creëren dat perfect is afgestemd op de unieke behoeften van de individuele cliënt. Ik zie elk obstakel als een mogelijkheid. In de huidige zorgpraktijk merk ik dat er vaak te snel grenzen worden gesteld aan wat cliënten kunnen bereiken. Hier zet ik mij tegen af door niet alleen te focussen op wat tijdelijk onmogelijk lijkt, maar door actief oplossingen en alternatieven te zoeken.',
      'Ik begeleid mensen die willen blijven bewegen, sterker willen worden, of vastlopen door klachten of beperkingen. Niet door ze stil te zetten maar door te zoeken naar wat wél kan. En dat stap voor stap, verantwoord op te bouwen.',
      'Voor mij is fysiotherapie geen opzichzelfstaand traject. Geen eindpunt. Geen ‘pauze’ in je proces. Het is een onderdeel van het geheel.',
    ],
    photos: [
      { src: `${cdn}/maarten-groepssessie.webp`, alt: 'Maarten bespreekt trainingsplan met cliënten bij MAE' },
      { src: `${cdn}/maarten-behandelplan.webp`, alt: 'Maarten schrijft revalidatieplan op whiteboard' },
      { src: `${cdn}/maarten-training.webp`, alt: 'Maarten begeleidt krachttraining bij fysiotherapie' },
    ],
    steps: [
      {
        title: 'Intake, screening & onderzoek',
        text: 'Tijdens het intakegesprek bespreken we waar jij staat en waar je naartoe wilt. We doen een screening om ernstige oorzaken uit te sluiten, gevolgd door een lichamelijk en bewegingsonderzoek om de basis van je klacht in kaart te brengen.',
      },
      {
        title: 'Persoonlijk revalidatieplan',
        text: 'Na de intake ontvang je een op maat gemaakt revalidatieplan, volledig aangepast op wat jouw lichaam op dat moment aankan. Dit plan wordt elke week geüpdatet zodat je altijd traint op een niveau dat bij jou past.',
      },
      {
        title: 'Wekelijks online contactmoment',
        text: 'Wekelijks bespreken we hoe de uitvoering van je plan is verlopen. Je kunt trainingsvideo’s insturen voor concrete feedback en pijnscores bijhouden zodat we het plan continu kunnen afstemmen.',
      },
      {
        title: 'Maandelijkse fysieke afspraak',
        text: 'Iedere maand plannen we een persoonlijke afspraak van een uur om je voortgang te evalueren en samen verder te werken aan je herstel. In overleg is vaker mogelijk.',
      },
    ],
    credentials: [
      { year: '2022', text: 'Bachelor Fysiotherapie' },
      { year: '2025', text: 'The Performance Method (niveau 3)' },
    ],
  },

  merel: {
    name: 'Merel',
    variant: 'leefstijl',
    hero: {
      src: `${cdn}/merel-consult.webp`,
      alt: 'Merel leefstijlcoach bij MAE in gesprek met cliënt',
      objectPosition: 'center 22%',
    },
    about: [
      'Mijn naam is Merel en ik ben fervent krachtsporter, leefstijlcoach en personal coach. Ondanks mijn langdurige haat-liefde relatie met sport en voeding, heb ik geleerd hoe cruciaal een gezonde verbinding met deze aspecten is, zowel fysiek als mentaal. Mijn eigen worsteling met zelfbeeld en gezondheid heeft mij doen inzien hoe voeding en beweging kunnen bijdragen aan herstel, zowel in tijden van fysieke als mentale ziekte.',
      'Uit deze persoonlijke ervaring is een diepgewortelde liefde ontstaan om anderen te helpen bij het bereiken van een gezonder en meer gebalanceerd leven, waarbij zelfacceptatie centraal staat. Ik deel graag mijn geleerde lessen en ondersteun anderen bij hun transformatie naar een gezondere levensstijl.',
    ],
    photos: [
      { src: `${cdn}/merel-coaching.webp`, alt: 'Merel begeleidt cliënt bij leefstijlcoaching' },
      { src: `${cdn}/merel-training.webp`, alt: 'Merel begeleidt functionele training bij MAE' },
      { src: `${cdn}/merel-meting.webp`, alt: 'Lichaamsmeting als onderdeel van leefstijlcoaching' },
    ],
    steps: [
      {
        title: 'Intake & Basismeting',
        text: 'We brengen jouw volledige levensstijl in kaart: slaap, beweging, voeding, werk en privé. Samen stellen we doelen op en doen een basismeting.',
      },
      {
        title: 'Persoonlijk Plan',
        text: 'Je ontvangt een gepersonaliseerd leefstijlplan, voedingsplan en trainingsschema. Geen standaard dieet, maar een aanpak die bij jou past.',
      },
      {
        title: 'Technieksessie',
        text: 'We nemen alle oefeningen samen door zodat je weet hoe je ze correct uitvoert. Dit minimaliseert blessures en maximaliseert resultaat.',
      },
      {
        title: 'Wekelijkse Begeleiding',
        text: 'Via wekelijkse contactmomenten en maandelijkse evaluaties houden we je voortgang bij en passen we het plan aan waar nodig.',
      },
    ],
    credentials: [{ year: '2025', text: 'Sportkunde' }],
  },
};
