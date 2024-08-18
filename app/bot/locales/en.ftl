start = Hi { $name }! This bot allows you to monitor a crypto currency price changes.
    Click menu button to see available commands.

coin_not_found = Currency not found or not available anymore. Try again later.

search_wait = Enter the name or code of the crypto currency to search for:

nothing_found = Nothing found

found = Found { $number } coin(s). Select one for details and further actions:

market_message =
    <b>{ $name } ({ $coin })</b>

    <b>Price:</b> <code>{ $price } { $fiat }</code>
    <b>24H Volume:</b> <code>{ $volume } { $fiat }</code>
    <b>Last Update:</b> <code>{ $last_update }</code>

market_message_monitor =
    <b>{ $name } ({ $coin })</b>

    <b>Price:</b> <code>{ $price } { $fiat }</code>
    <b>24H Volume:</b> <code>{ $volume } { $fiat }</code>
    <b>Last Update:</b> <code>{ $last_update }</code>

    <b>Monitor:</b> <code>±{ $monitor_value }{ $monitor_type }</code>

add_monitor = Add Monitor

delete_monitor = Delete Monitor

use_buttons_alert = Use the buttons!

monitor_type_fixed = Fixed

monitor_type_percentage = Percentage

monitor_type_prompt = Select the type of price change to monitor:

monitor_threshold_prompt = Enter the price change threshold ({ $type }):

monitor_number_validation = Only numbers, e.g. <code>12</code> or <code>1.4</code>. Max: 1,000,000

monitor_created = Monitor successfully created.

monitor_deleted = Monitor has been deleted.

monitor_bad_threshold = Cannot create monitor with this threshold value.

are_you_sure = Are you sure?