from flask_restx import fields  # type: ignore

from foodbank_southlondon.api import models, rest


# INTERNALS
SHIPPING_METHOD_COLLECTION = "Collection"


class StrBoolean(fields.Raw):
    def format(self, value: str) -> bool:
        if isinstance(value, bool):
            return value
        return True if value.upper() == "YES" else False


request = rest.model("ClientRequest", {
    "request_id": fields.String(required=True, description="The unique ID of the Client Request",
                                example="ACYDBNgidDBRKTk_WpZiWnVOKVzOzbPPXzO3NxqUlTK9cNXuEfpOLTRRT5YV2dnscmWOucg"),
    "timestamp": fields.String(attribute="Timestamp", required=True, description="The timestamp of the form submission in the format of "
                               "DD/MM/YYYY HH:MM:SS", example="30/04/2020 18:27:57"),
    "voucher_number": fields.String(attribute="Voucher Number", required=True, description="The unique FoodBank Voucher Number of the Client "
                                    "(consistent across requests)", example="H-00001-00001"),
    "client_full_name": fields.String(attribute="Client Full Name", required=True, description="The full name of the Client", example="John Smith"),
    "phone_number": fields.String(attribute="Phone Number", required=False, description="The Client's contact phone number", example="07123 456 789"),
    "packing_date": fields.String(attribute="Packing Date", required=True, description="The date that the food parcel should be delivered in the "
                                  "format of DD/MM/YYYY", example="23/04/2020"),
    "time_of_day": fields.String(attribute="Time of Day", required=True, description="The time of day that the food parcel should be packed.",
                                 example="AM"),
    "address_line_1": fields.String(attribute="Address Line 1", required=True, description="The first line of the address",
                                    example="8 Terrace Mews"),
    "address_line_2": fields.String(attribute="Address Line 2", required=False, description="The second line of the address", example="Portswood"),
    "town": fields.String(attribute="Town", required=False, description="The town of the address", example="Solihull"),
    "county": fields.String(attribute="County", required=False, description="The county of the address", example="London"),
    "postcode": fields.String(attribute="Postcode", required=True, description="The postcode of the address", example="SW9 1AF"),
    "delivery_instructions": fields.String(attribute="Delivery Instructions", required=False, description="Delivery instructions for the driver",
                                           example="Please buzz flat 1"),
    "gender": fields.String(attribute="Gender", required=True, description="The provided gender of the Client", example="Male"),
    "household_size": fields.String(attribute="Household Size", required=True, description="The type of request", example="Single"),
    "number_of_adults": fields.String(attribute="Number of Adults", required=True,
                                      description="The number of individuals living at the household that are aged 16 or over", example="2"),
    "number_of_children": fields.String(attribute="Number of Children", required=False, description="The number of children living at the household",
                                        example="1"),
    "age_and_gender_of_children": fields.String(attribute="Age and Gender of Children", required=True, description="The age range and gender of the "
                                                "children living at the household", example="Girl - 3, Boy - 6"),
    "dietary_requirements": fields.String(attribute="Dietary Requirements", required=True,
                                          description="Whether the Client has any dietary requirements", example="Meat, No Dairy"),
    "feminine_products_required": fields.String(attribute="Feminine Products Required?", required=True, description="Whether the Client requires "
                                                "feminine products", example="No"),
    "baby_products_required": fields.String(attribute="Baby Products Required?", required=True, description="Whether the Client requires baby "
                                            "products", example="Don't Know"),
    "pet_food_required": fields.String(attribute="Pet Food Required?", required=True, description="Whether the Client requires pet food",
                                       example="Yes"),
    "other_requirements": fields.String(attribute="Other Requirements", required=True,
                                        description="Additional, non-dietary requirements or season-specific asks", example="Christmas Presents"),
    "extra_information": fields.String(attribute="Extra Information", required=False, description="Any extra information to be noted",
                                       example="No dairy"),
    "flag_for_attention": StrBoolean(attribute="Flag for Attention", required=True, default="",
                                     description="Whether or not this request should be flagged for attention", example=True),
    "signposting_call": StrBoolean(attribute="Signposting Call", required=True, default="",
                                   description="Whether or not this request should be labelled as a signposted call", example=True),
    "shipping_method": fields.String(attribute="Shipping Method", required=True,
                                     description="Whether the food parcel will be delivered or collected.", example="Collection"),
    "collection_date": fields.String(attribute="Collection Date", required=False, description="The date that the food parcel should be collected in "
                                     "the format of DD/MM/YYYY", example="01/05/2020"),
    "collection_centre": fields.String(attribute="Collection Centre", required=False,
                                       description="The centre that the client should collect the food parcel from.", example="Vauxhall"),
    "vauxhall_hope_church_collection_time": fields.String(attribute="Vauxhall Hope Church Collection Time", required=False,
                                                          description="The time that the food parcel should be collected from the Vauxhall Hope "
                                                          "Church centre, in the format of HH:MM", example="12:30"),
    "waterloo___st_george_the_martyr_collection_time": fields.String(attribute="Waterloo - St George the Martyr Collection Time", required=False,
                                                                     description="The time that the food parcel should be collected from the "
                                                                     "Waterloo - St George the Martyr centre, in the format of HH:MM",
                                                                     example="12:30"),
    "waterloo___oasis_collection_time": fields.String(attribute="Waterloo - Oasis Collection Time", required=False,
                                                      description="The time that the food parcel should be collected from the Waterloo - Oasis "
                                                      "centre, in the format of HH:MM", example="12:30"),
    "n&b___emmanuel_church_collection_time": fields.String(attribute="N&B - Emmanuel Church Collection Time", required=False,
                                                           description="The time that the food parcel should be collected from the N&B - Emmanuel "
                                                           "Church centre, in the format of HH:MM", example="12:30"),
    "n&b___st_lukes_collection_time": fields.String(attribute="N&B - St Lukes Collection Time", required=False,
                                                    description="The time that the food parcel should be collected from the N&B - St Lukes centre, "
                                                    "in the format of HH:MM", example="12:30"),
    "edit_details_url": fields.String(required=True, description="The Google Forms edit response URL that can be used to update details of the "
                                      "Client Request", example="https://docs.google.com/forms/d/e/1FAIpQLSfb94-4k-Pkf3ccBqd2WR-yzMBdmqdehYBbnN1HLrm"
                                      "E9caneA/viewform?edit2=2_ABaOnueK_9ztK8RlxxBe6Jf0wvs9rAwoi30EwATe24VtNeMhgazghzzd4pgibH-HHn_RDZQ"),
    "congestion_zone": fields.Boolean(required=True, description="Whether or not the postcode is in the congestion zone.", example=True)
})

page_of_requests = rest.inherit("ClientRequestsPage", models.pagination, {
    "items": fields.List(fields.Nested(request))
})

distinct_request_values = rest.model("DistinctClientRequestValues", {
    "values": fields.List(fields.String(required=True, description="A distinct value of the requested attribute across the Requests data"))
})
