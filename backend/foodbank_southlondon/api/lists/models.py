from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import rest


LIST_NAMES = {
    "single": "Single",
    "family_of_2": "Family of 2",
    "family_of_3": "Family of 3",
    "family_of_4": "Family of 4",
    "family_of_5+": "Family of 5+"
}

_item_description_field = fields.String(attribute="Item Description", required=True, description="A description of the item", example="Eggs")

_all_lists_item_fields = {"item_description": _item_description_field}
for field_name, attribute in LIST_NAMES.items():
    _all_lists_item_fields[f"{field_name}_quantity"] = fields.String(attribute=f"{attribute} - Quantity", required=False, description="The quantity "
                                                                     f"of the item for the Household Size, {field_name}", example="3")
    _all_lists_item_fields[f"{field_name}_notes"] = fields.String(attribute=f"{attribute} - Notes", required=False, description=f"Item-specific "
                                                                  f"notes for the Household Size, {field_name}", example="Free range if available")

all_lists_item = rest.model("AllShoppingListsItem", _all_lists_item_fields)

all_lists_items = rest.model("AllShoppingListsItems", {
    "notes": fields.String(required=False, description="General notes that apply across all lists and items", example="Use fresh produce"),
    "items": fields.List(fields.Nested(all_lists_item))
})

one_list_item = rest.model("ShoppingListItem", {
    "item_description": _item_description_field,
    "quantity": fields.String(attribute=f"Quantity", required=False, description="The quantity of the item for the requested Household Size",
                              example="3"),
    "notes": fields.String(attribute=f"Notes", required=False, description=f"Item-specific notes for the requested Household Size",
                           example="Free range if available")
})

one_list_items = rest.model("ShoppingListItems", {
    "items": fields.List(fields.Nested(one_list_item))
})
