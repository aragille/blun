import { useSyncExternalStore } from 'react'

export type Lang = 'en' | 'ru'

const STORAGE_KEY = 'blun-lang'

let lang: Lang = (() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'ru') return stored
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
})()

document.documentElement.lang = lang

const listeners = new Set<() => void>()

export function setLang(next: Lang) {
  lang = next
  localStorage.setItem(STORAGE_KEY, next)
  document.documentElement.lang = next
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Subscribe a component to the current language. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, () => lang)
}

export function getLang(): Lang {
  return lang
}

type Dict = Record<string, string>

const en: Dict = {
  // landing nav
  'nav.product': 'Product',
  'nav.how': 'How it works',
  'nav.open': 'Open app',
  // hero
  'hero.badge': 'local-first · no accounts · yours',
  'hero.t1': 'Your feedback deserves',
  'hero.t2': 'a home',
  'hero.sub':
    "blun is a personal feedback inbox. Capture praise, issues and ideas from the people around you — linked to who said it and what it's about. Nothing leaves your machine.",
  'hero.placeholder': 'Type your first feedback…',
  'hero.save': 'Save it →',
  'hero.hint.pre': 'press',
  'hero.hint.key': 'enter',
  'hero.hint.post': '— it lands in your inbox, already saved',
  // marquee
  'mq.1': 'Newsletter needs a dark mode screenshot',
  'mq.2': 'CSV export drops the timezone',
  'mq.3': 'Dark charts still use light gridlines',
  'mq.4': 'Onboarding checklist is delightful',
  'mq.5': 'Exports could include archived rows',
  'mq.6': 'Launch post got 40 replies in an hour',
  // product section
  'product.label': 'three things. nothing else.',
  'product.t1': 'Feedback, people,',
  'product.t2': 'features',
  'product.sub':
    'No boards, no sprints, no workspace settings. blun keeps exactly three lists and connects them, so every note has a face and a place.',
  'trio.feedback.title': 'Feedback',
  'trio.feedback.desc': 'Praise, issues and ideas in one stream. Cycle each through new → reviewed → done.',
  'trio.contacts.title': 'Contacts',
  'trio.contacts.desc': 'The coworkers behind the feedback. Every note remembers who said it.',
  'trio.features.title': 'Features',
  'trio.features.desc': 'The parts of your product feedback points at. See what people talk about most.',
  // how it works
  'how.label': 'how it works',
  'how.t1': 'Catch it, tag it,',
  'how.t2': 'close it',
  'step.1.title': 'Capture in seconds',
  'step.1.desc': 'Someone says something worth keeping? Type it before it evaporates. One box, no form.',
  'step.2.title': 'Link who and what',
  'step.2.desc': 'Attach a contact and a feature. The note gains context without a single required field.',
  'step.3.title': 'Work the inbox to zero',
  'step.3.desc': 'Filter by kind or status, cycle notes to done, and watch the stream stay honest.',
  // cta
  'cta.t1': 'Every piece of feedback, one',
  'cta.t2': 'quiet',
  'cta.t3': 'inbox',
  'cta.sub': 'Seeded with sample data so it feels alive the moment you open it. Reset anytime.',
  'cta.btn': 'Open your inbox →',
  'footer.tag': 'local-first · stored in your browser · ©',
  // app shell
  'side.inbox': 'Inbox',
  'side.contacts': 'Contacts',
  'side.features': 'Features',
  'side.reset': 'Reset to seed',
  'side.reset.confirm': 'Reset all data back to the sample seed?',
  // inbox
  'inbox.title': 'Inbox',
  'notes.one': '{n} note',
  'notes.other': '{n} notes',
  'newcount.one': '{n} new',
  'newcount.other': '{n} new',
  'composer.placeholder': 'What did you hear? Capture it before it evaporates…',
  'kind.praise': 'Praise',
  'kind.issue': 'Issue',
  'kind.idea': 'Idea',
  'btn.save': 'Save',
  'btn.cancel': 'Cancel',
  'btn.saveChanges': 'Save changes',
  'field.source': 'Source',
  'field.priority': 'Priority',
  'field.contact': 'Contact',
  'field.feature': 'Feature',
  'field.tags': 'Tags',
  'sel.noSource': 'No source',
  'sel.noPriority': 'No priority',
  'sel.noContact': 'No contact',
  'sel.noFeature': 'No feature',
  'sel.source': 'Source…',
  'sel.priority': 'Priority…',
  'sel.contact': 'Contact…',
  'sel.feature': 'Feature…',
  'via.slack': 'via slack',
  'via.email': 'via email',
  'via.meeting': 'via meeting',
  'via.call': 'via call',
  'via.support': 'via support',
  'via.other': 'via other',
  'prio.low': 'low',
  'prio.medium': 'medium',
  'prio.high': 'high',
  'status.new': 'new',
  'status.reviewed': 'reviewed',
  'status.done': 'done',
  'filter.all': 'All',
  'filter.btn': 'Filters',
  'filter.kind': 'kind',
  'filter.source': 'source',
  'filter.priority': 'priority',
  'filter.linked': 'linked to',
  'filter.anyContact': 'Any contact',
  'filter.anyFeature': 'Any feature',
  'filter.clear': 'Clear all filters',
  'search.feedback': 'Search feedback, tags, people…',
  'search.features': 'Search features…',
  'inbox.empty': "Nothing here. Either you're at inbox zero or your filters are hiding it.",
  'unattributed': 'Unattributed',
  'tags.add': 'Add tags…',
  'tags.addNew': 'Add',
  'status.cycle': 'Cycle status: new → reviewed → done',
  'action.edit': 'Edit',
  'action.delete': 'Delete',
  'action.unlink': 'Unlink',
  // sources (plain nouns, used in filter chips)
  'src.slack': 'slack',
  'src.email': 'email',
  'src.meeting': 'meeting',
  'src.call': 'call',
  'src.support': 'support',
  'src.other': 'other',
  // contacts page
  'contacts.title': 'Contacts',
  'contacts.sub': 'The coworkers behind your feedback.',
  'contacts.newName': 'New contact name…',
  'contacts.role': 'Role (e.g. Engineering)',
  'contacts.add': 'Add contact',
  'contacts.defaultRole': 'Coworker',
  'contacts.delete': 'Their feedback stays, just unattributed.',
  'contacts.name': 'Name',
  'contacts.rolePh': 'Role',
  // features page
  'features.title': 'Features',
  'features.sub': 'The parts of your product feedback points at.',
  'features.newName': 'New feature name…',
  'features.desc': 'One-line description',
  'features.add': 'Add feature',
  'features.delete': 'Its feedback stays, just unlinked.',
  'features.link': '+ Link feedback',
  'features.namePh': 'Name',
  // time
  'time.now': 'just now',
  'time.m': '{n}m ago',
  'time.h': '{n}h ago',
  'time.d': '{n}d ago',
  // confirm modals
  'confirm.title.feedback': 'Delete this note?',
  'confirm.title.contact': 'Delete {name}?',
  'confirm.title.feature': 'Delete “{name}”?',
  'confirm.title.reset': 'Reset all data?',
  'confirm.msg.feedback': 'This note will be gone for good.',
  'confirm.msg.reset': 'Everything goes back to the sample seed. Your own notes will be lost.',
  'confirm.delete': 'Delete',
  'confirm.reset': 'Reset',
  // tags summary
  'tags.selected.one': '{n} selected',
  'tags.selected.other': '{n} selected',
}

const ru: Dict = {
  'nav.product': 'Продукт',
  'nav.how': 'Как это работает',
  'nav.open': 'Открыть',
  'hero.badge': 'локально · без аккаунтов · только ваше',
  'hero.t1': 'Вашему фидбеку нужен',
  'hero.t2': 'дом',
  'hero.sub':
    'blun — личный инбокс для фидбека. Похвала, проблемы и идеи от людей вокруг — с привязкой к тому, кто и о чём сказал. Всё остаётся у вас.',
  'hero.placeholder': 'Введите первый фидбек…',
  'hero.save': 'Сохранить →',
  'hero.hint.pre': 'нажмите',
  'hero.hint.key': 'enter',
  'hero.hint.post': '— и он уже сохранён в вашем инбоксе',
  'mq.1': 'Рассылке нужен скриншот тёмной темы',
  'mq.2': 'CSV-экспорт теряет часовой пояс',
  'mq.3': 'Тёмные графики всё ещё со светлой сеткой',
  'mq.4': 'Чек-лист онбординга — восторг',
  'mq.5': 'В экспорт можно добавить архивные строки',
  'mq.6': 'Пост о запуске: 40 ответов за час',
  'product.label': 'три сущности. ничего лишнего.',
  'product.t1': 'Фидбек, люди,',
  'product.t2': 'фичи',
  'product.sub':
    'Никаких досок, спринтов и настроек воркспейса. В blun ровно три связанных списка — у каждой записи есть лицо и место.',
  'trio.feedback.title': 'Фидбек',
  'trio.feedback.desc': 'Похвала, проблемы и идеи в одном потоке. Ведите каждую запись: новое → просмотрено → готово.',
  'trio.contacts.title': 'Контакты',
  'trio.contacts.desc': 'Коллеги, стоящие за фидбеком. Каждая запись помнит, кто это сказал.',
  'trio.features.title': 'Фичи',
  'trio.features.desc': 'Части продукта, о которых говорит фидбек. Видно, что обсуждают чаще всего.',
  'how.label': 'как это работает',
  'how.t1': 'Поймайте, отметьте,',
  'how.t2': 'закройте',
  'step.1.title': 'Записывайте за секунды',
  'step.1.desc': 'Кто-то сказал что-то важное? Запишите, пока не испарилось. Одно поле, никаких форм.',
  'step.2.title': 'Свяжите «кто» и «что»',
  'step.2.desc': 'Добавьте контакт и фичу. Запись получает контекст — без единого обязательного поля.',
  'step.3.title': 'Разбирайте инбокс до нуля',
  'step.3.desc': 'Фильтруйте по типу и статусу, доводите записи до «готово» — поток остаётся честным.',
  'cta.t1': 'Весь фидбек — в одном',
  'cta.t2': 'тихом',
  'cta.t3': 'инбоксе',
  'cta.sub': 'Внутри уже есть демо-данные — приложение живое с первого открытия. Сброс в один клик.',
  'cta.btn': 'Открыть инбокс →',
  'footer.tag': 'локально · хранится в вашем браузере · ©',
  'side.inbox': 'Инбокс',
  'side.contacts': 'Контакты',
  'side.features': 'Фичи',
  'side.reset': 'Сбросить данные',
  'side.reset.confirm': 'Сбросить все данные к демо-набору?',
  'inbox.title': 'Инбокс',
  'notes.one': '{n} заметка',
  'notes.few': '{n} заметки',
  'notes.many': '{n} заметок',
  'newcount.one': '{n} новая',
  'newcount.few': '{n} новые',
  'newcount.many': '{n} новых',
  'composer.placeholder': 'Что вы услышали? Запишите, пока не испарилось…',
  'kind.praise': 'Похвала',
  'kind.issue': 'Проблема',
  'kind.idea': 'Идея',
  'btn.save': 'Сохранить',
  'btn.cancel': 'Отмена',
  'btn.saveChanges': 'Сохранить изменения',
  'field.source': 'Источник',
  'field.priority': 'Приоритет',
  'field.contact': 'Контакт',
  'field.feature': 'Фича',
  'field.tags': 'Теги',
  'sel.noSource': 'Без источника',
  'sel.noPriority': 'Без приоритета',
  'sel.noContact': 'Без контакта',
  'sel.noFeature': 'Без фичи',
  'sel.source': 'Источник…',
  'sel.priority': 'Приоритет…',
  'sel.contact': 'Контакт…',
  'sel.feature': 'Фича…',
  'via.slack': 'из slack',
  'via.email': 'из почты',
  'via.meeting': 'со встречи',
  'via.call': 'из звонка',
  'via.support': 'из саппорта',
  'via.other': 'другое',
  'prio.low': 'низкий',
  'prio.medium': 'средний',
  'prio.high': 'высокий',
  'status.new': 'новое',
  'status.reviewed': 'просмотрено',
  'status.done': 'готово',
  'filter.all': 'Все',
  'filter.btn': 'Фильтры',
  'filter.kind': 'тип',
  'filter.source': 'источник',
  'filter.priority': 'приоритет',
  'filter.linked': 'связано с',
  'filter.anyContact': 'Любой контакт',
  'filter.anyFeature': 'Любая фича',
  'filter.clear': 'Сбросить фильтры',
  'search.feedback': 'Поиск по фидбеку, тегам, людям…',
  'search.features': 'Поиск по фичам…',
  'inbox.empty': 'Пусто. Либо инбокс на нуле, либо всё скрыто фильтрами.',
  'unattributed': 'Без автора',
  'tags.add': 'Добавить теги…',
  'tags.addNew': 'Добавить',
  'status.cycle': 'Сменить статус: новое → просмотрено → готово',
  'action.edit': 'Изменить',
  'action.delete': 'Удалить',
  'action.unlink': 'Отвязать',
  'src.slack': 'slack',
  'src.email': 'почта',
  'src.meeting': 'встреча',
  'src.call': 'звонок',
  'src.support': 'саппорт',
  'src.other': 'другое',
  'contacts.title': 'Контакты',
  'contacts.sub': 'Коллеги, стоящие за вашим фидбеком.',
  'contacts.newName': 'Имя нового контакта…',
  'contacts.role': 'Роль (например, Инженерия)',
  'contacts.add': 'Добавить',
  'contacts.defaultRole': 'Коллега',
  'contacts.delete': 'Фидбек останется, но без автора.',
  'contacts.name': 'Имя',
  'contacts.rolePh': 'Роль',
  'features.title': 'Фичи',
  'features.sub': 'Части продукта, на которые указывает фидбек.',
  'features.newName': 'Название новой фичи…',
  'features.desc': 'Короткое описание',
  'features.add': 'Добавить',
  'features.delete': 'Фидбек останется, но без привязки.',
  'features.link': '+ Привязать фидбек',
  'features.namePh': 'Название',
  'time.now': 'только что',
  'time.m': '{n} мин назад',
  'time.h': '{n} ч назад',
  'time.d': '{n} дн назад',
  'confirm.title.feedback': 'Удалить заметку?',
  'confirm.title.contact': 'Удалить {name}?',
  'confirm.title.feature': 'Удалить «{name}»?',
  'confirm.title.reset': 'Сбросить все данные?',
  'confirm.msg.feedback': 'Заметка исчезнет навсегда.',
  'confirm.msg.reset': 'Всё вернётся к демо-набору. Ваши заметки будут потеряны.',
  'confirm.delete': 'Удалить',
  'confirm.reset': 'Сбросить',
  'tags.selected.one': 'выбран {n}',
  'tags.selected.few': 'выбрано {n}',
  'tags.selected.many': 'выбрано {n}',
}

const dicts: Record<Lang, Dict> = { en, ru }

function interpolate(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`))
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const s = dicts[lang][key] ?? dicts.en[key] ?? key
  return interpolate(s, vars)
}

function pluralForm(l: Lang, n: number): string {
  if (l === 'ru') {
    const m10 = n % 10
    const m100 = n % 100
    if (m10 === 1 && m100 !== 11) return 'one'
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'few'
    return 'many'
  }
  return n === 1 ? 'one' : 'other'
}

/** Pluralized translation: tp('notes', 5) → "5 notes" / "5 заметок" */
export function tp(base: string, n: number): string {
  const form = pluralForm(lang, n)
  const key = `${base}.${form}`
  const s = dicts[lang][key] ?? dicts[lang][`${base}.other`] ?? dicts.en[key] ?? dicts.en[`${base}.other`] ?? key
  return interpolate(s, { n })
}
