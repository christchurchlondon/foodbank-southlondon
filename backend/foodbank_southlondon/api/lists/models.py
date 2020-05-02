from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import rest


LIST_NAMES = ("Single", "Family of 2", "Family of 3", "Family of 4", "Family of 5+")

_list_notes_field = fields.String(required=False, description="General notes that apply across all lists and items", example="Use fresh produce")
_item_description_field = fields.String(required=True, description="A description of the item", example="Eggs")
_item_quantity_field = fields.Integer(required=False, description="The quantity of the item for this Household size", example=3)
_item_notes_field = fields.String(required=False, description=f"Item-specific notes for this Household size", example="Free range if available")

_all_lists_item_fields = {"Item Description": _item_description_field}
for list_name in LIST_NAMES:
    _all_lists_item_fields[f"{list_name} - Quantity"] = _item_quantity_field
    _all_lists_item_fields[f"{list_name} = Notes"] = _item_notes_field

all_lists_item = rest.model("Lists Item", _all_lists_item_fields)

all_lists_items = rest.model("Lists Items", {
    "Notes": _list_notes_field,
    "items": fields.List(fields.Nested(all_lists_item))
})

one_list_item = rest.Model("List Item", {
    "Item Description": _item_description_field,
    "Quantity": _item_quantity_field,
    "Notes": _item_notes_field
})

one_list_items = rest.Model("List Items", {
    "Notes": _list_notes_field,
    "items": fields.List(fields.Nested(one_list_item))
})
