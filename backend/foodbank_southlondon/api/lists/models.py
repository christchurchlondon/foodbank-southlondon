from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import rest


LIST_NAMES = (
    "single",
    "family_of_2",
    "family_of_3",
    "family_of_4",
    "family_of_5+"
)

_item_description_field = fields.String(required=True, description="A description of the item", example="Eggs")
_notes_field = fields.String(required=False, description="General notes that apply across all lists and items", example="Use fresh produce")

_all_lists_item_fields = {"item_description": _item_description_field}
for field_name in LIST_NAMES:
    _all_lists_item_fields[f"{field_name}_quantity"] = fields.String(required=False, description="The quantity of the item for the Household Size, "
                                                                     f"{field_name}", example="3")
    _all_lists_item_fields[f"{field_name}_notes"] = fields.String(required=False, description=f"Item-specific notes for the Household Size, "
                                                                  f"{field_name}", example="Free range if available")

_all_lists_item = rest.model("AllShoppingListsItem", _all_lists_item_fields)

_one_list_item = rest.model("ShoppingListItem", {
    "item_description": _item_description_field,
    "quantity": fields.String(required=False, description="The quantity of the item for the requested Household Size", example="3"),
    "notes": fields.String(required=False, description=f"Item-specific notes for the requested Household Size", example="Free range if available")
})


all_lists_items = rest.model("AllShoppingListsItems", {
    "notes": _notes_field,
    "items": fields.List(fields.Nested(_all_lists_item))
})

one_list_items = rest.model("ShoppingListItems", {
    "notes": _notes_field,
    "items": fields.List(fields.Nested(_one_list_item))
})
