from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import rest


LIST_NAMES = ("Single", "Family of 2", "Family of 3", "Family of 4", "Family of 5+")

_item_description_field = fields.String(required=True, description="A description of the item", example="Eggs")
_quantity_field = fields.String(required=False, description="The quantity of the item for this Household size", example="3")
_notes_field = fields.String(required=False, description=f"Item-specific notes for this Household size", example="Free range if available")

_all_lists_item_fields = {"Item Description": _item_description_field}
for list_name in LIST_NAMES:
    _all_lists_item_fields[f"{list_name} - Quantity"] = _quantity_field
    _all_lists_item_fields[f"{list_name} - Notes"] = _notes_field

all_lists_item = rest.model("All Shopping Lists Item", _all_lists_item_fields)

all_lists_items = rest.model("All Shopping Lists Items", {
    "Notes": fields.String(required=False, description="General notes that apply across all lists and items", example="Use fresh produce"),
    "items": fields.List(fields.Nested(all_lists_item))
})

one_list_item = rest.model("Shopping List Item", {
    "Item Description": _item_description_field,
    "Quantity": _quantity_field,
    "Notes": _notes_field
})

one_list_items = rest.model("Shopping List Items", {
    "items": fields.List(fields.Nested(one_list_item))
})
