from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models, rest


request = rest.model("ClientRequest", {
    "request_id": fields.String(required=True, description="The unique ID of the Client Request",
                                example="ACYDBNgidDBRKTk_WpZiWnVOKVzOzbPPXzO3NxqUlTK9cNXuEfpOLTRRT5YV2dnscmWOucg"),
    "timestamp": fields.String(attribute="Timestamp", required=True, description="The timestamp of the form submission in the format of "
                               "DD/MM/YYYY HH:MM:SS", example="30/04/2020 18:27:57"),
    "reference_number": fields.String(attribute="Reference Number", required=True, description="The unique FoodBank Reference Number of the Client "
                                      "(consistent across requests)", example="H-00001-00001"),
    "client_full_name": fields.String(attribute="Client Full Name", required=True, description="The full name of the Client", example="John Smith"),
    "phone_number": fields.String(attribute="Phone Number", required=False, description="The Client's contact phone number", example="07123 456 789"),
    "delivery_date": fields.String(attribute="Delivery Date", required=True, description="The date that the food parcel should be delivered in the "
                                   "format of DD/MM/YYYY", example="23/04/2020"),
    "address_line_1": fields.String(attribute="Addresss Line 1", required=True, description="The first line of the address",
                                    example="8 Terrace Mews"),
    "address_line_2": fields.String(attribute="Address Line 2", required=False, description="The second line of the address", example="Portswood"),
    "town": fields.String(attribute="Town", required=False, description="The town of the address", example="Solihull"),
    "county": fields.String(attribute="County", required=False, description="The county of the address", example="London"),
    "postcode": fields.String(attribute="Postcode", required=True, description="The postcode of the address", example="SW9 1AF"),
    "delivery_instructions": fields.String(attribute="Delivery Instructions", required=False, description="Delivery instructions for the driver",
                                           example="Please buzz flat 1"),
    "household_size": fields.String(attribute="Household Size", required=True, description="The type of request", example="Single",
                                    enum=["Single", "Family of 2", "Family of 3", "Family of 4", "Family of 5", "Family of 6", "Family of 7",
                                          "Family of 8", "Family of 9+"]),
    "number_of_adults": fields.String(attribute="Number of Adults", required=True, description="The number of individuals living at the household "
                                      "that are aged 16 or over", example="2"),
    "number_of_children": fields.String(attribute="Number of Children", required=False, description="The number of children living at the household",
                                        example="1"),
    "age_of_children": fields.String(attribute="Age of Children", required=True, description="The age range of the children living at the household",
                                     example="3-6"),
    "dietary_requirements": fields.String(attribute="Dietary Requirements", required=True, description="Whether the Client has any dietary "
                                          "requirements", example="No", enum=["Yes", "No", "Don't Know"]),
    "feminine_products_required": fields.String(attribute="Feminine Products Required?", required=True, description="Whether the Client requires "
                                                "feminine products", example="No", enum=["Yes", "No", "Don't Know"]),
    "baby_products_required": fields.String(attribute="Baby Products Required?", required=True, description="Whether the Client requires baby "
                                            "products", example="Don't Know", enum=["Yes", "No", "Don't Know"]),
    "pet_food_required": fields.String(attribute="Pet Food Required?", required=True, description="Whether the Client requires pet food",
                                       example="Yes", enum=["Yes", "No", "Don't Know"]),
    "extra_information": fields.String(attribute="Extra Information", required=False, description="Any extra information to be noted",
                                       example="No dairy"),
    "edit_details_url": fields.String(required=True, description="The Google Forms edit response URL that can be used to update details of the Client"
                                      "Request", example="https://docs.google.com/forms/d/e/1FAIpQLSfb94-4k-Pkf3ccBqd2WR-yzMBdmqdehYBbnN1HLrmE9caneA/"
                                      "viewform?edit2=2_ABaOnueK_9ztK8RlxxBe6Jf0wvs9rAwoi30EwATe24VtNeMhgazghzzd4pgibH-HHn_RDZQ")
})

page_of_requests = rest.inherit("ClientRequestsPage", models.pagination, {
    "items": fields.List(fields.Nested(request))
})

distinct_request_values = rest.model("DistinctClientRequestValues", {
    "values": fields.List(fields.String(required=True, description="A distinct value of the requested attribute across the Requests data"))
})
