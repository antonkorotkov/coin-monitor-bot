start = Привіт { $name }! Цей бот дозволяє мониторити зміни цін криптовалют.
    Натисни на кнопку меню, щоб побачити перелік доступних команд.

coin_not_found = Криптовалюта не знайдена або більше недоступна. Спробуйте пізніше.

search_wait = Введіть імʼя або код криптовалюти для пошуку:

nothing_found = Нічого не знайдено

found = Знайдено криптовалют: { $number }. Виберіть одну, щоб побачити деталі та додаткові дії:

market_message =
    <b>{ $name } ({ $coin })</b>

    <b>Ціна:</b> <code>{ $price } { $fiat }</code>
    <b>24H Обʼєм:</b> <code>{ $volume } { $fiat }</code>
    <b>Оновлено:</b> <code>{ $last_update }</code>

market_message_monitor =
    <b>{ $name } ({ $coin })</b>

    <b>Ціна:</b> <code>{ $price } { $fiat }</code>
    <b>24H Обʼєм:</b> <code>{ $volume } { $fiat }</code>
    <b>Оновлено:</b> <code>{ $last_update }</code>

    <b>Моніторінг:</b> <code>±{ $monitor_value }{ $monitor_type }</code>

add_monitor = Додати Монітор

delete_monitor = Видалити Монітор

use_buttons_alert = Використовуйте кнопки!

monitor_type_fixed = Фіксований

monitor_type_percentage = Відсотки

monitor_type_prompt = Оберіть тип зміни ціни для моніторінгу:

monitor_threshold_prompt = Вкажіть поріг зміни ціни ({ $type }):

monitor_number_validation = Тільки числа, наприклад <code>12</code> або <code>1.4</code>. Максимум: 1,000,000

monitor_created = Монітор успішно створений.

monitor_deleted = Монитор було видалено.

monitor_bad_threshold = Неможливо створити монітор з таким значенням порогу.

are_you_sure = Ви впевнені?

delete = Видалити

create = Створити

cancel = Відміна

add_monitor_confirmation = Ви збираєтесь створити моніторинг ціни типу <b>{ $type }</b> для <code>{ $coin }</code> з порогом <code>{ $value }</code>

monitors_limit = Ви не можете мати більше 5 моніторів