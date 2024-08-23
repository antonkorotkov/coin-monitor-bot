start = Привет { $name }! Этот бот позволяет следить за изменениями цен криптовалют.
    Нажми на кнопку меню, чтобы увидеть список доступных команд.

coin_not_found = Криптовалюта не найдена или больше недоступна. Попробуйте позже.

search_wait = Введите имя или код криптовалюты для поиска:

nothing_found = Ничего не найдено

found = Найдено криптовалют: { $number }. Выберите одну, чтобы увидеть детали и дополнительные действия:

market_message =
    <b>{ $name } ({ $coin })</b>

    <b>Цена:</b> <code>{ $price } { $fiat }</code>
    <b>24H Объем:</b> <code>{ $volume } { $fiat }</code>
    <b>Обновлено:</b> <code>{ $last_update }</code>

market_message_monitor =
    <b>{ $name } ({ $coin })</b>

    <b>Цена:</b> <code>{ $price } { $fiat }</code>
    <b>24H Объем:</b> <code>{ $volume } { $fiat }</code>
    <b>Обновлено:</b> <code>{ $last_update }</code>

    <b>Мониторинг:</b> <code>±{ $monitor_value }{ $monitor_type }</code>

add_monitor = Добавить Монитор

delete_monitor = Удалить Монитор

use_buttons_alert = Используйте кнопки!

monitor_type_fixed = Фиксированный

monitor_type_percentage = Проценты

monitor_type_prompt = Выберите тип изменения цены для мониторинга:

monitor_threshold_prompt = Укажите порог изменения цены ({ $type }):

monitor_number_validation = Только числа, например <code>12</code> или <code>1.4</code>. Максимум: 1,000,000

monitor_created = Монитор успешно создан.

monitor_deleted = Монитор удален.

monitor_bad_threshold = Невозможно создать монитор с таким значением порога.

are_you_sure = Вы уверены?

delete = Удалить

create = Создать

cancel = Отмена

add_monitor_confirmation = Вы собираетесь создать ценовой монитор типа <b>{ $type }</b> для <code>{ $coin }</code> с порогом <code>{ $value }</code>

monitors_limit = Вы не можете иметь больше 5 мониторов