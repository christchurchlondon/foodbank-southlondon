from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models, rest


request = rest.model("Client Request", {
    "RequestID": fields.String(required=True, description="The unique ID of the Client Request",
                               example="ACYDBNgidDBRKTk_WpZiWnVOKVzOzbPPXzO3NxqUlTK9cNXuEfpOLTRRT5YV2dnscmWOucg"),
    "Timestamp": fields.String(required=True, description="The timestamp of the form submission in the format of DD/MM/YYYY HH:MM:SS",
                               example="30/04/2020 18:27:57"),
    "Reference Number": fields.String(required=True, description="The unique FoodBank Reference Number of the Client (consistent across requests)",
                                      example="H-00001-00001"),
    "Client Full Name": fields.String(required=True, description="The full name of the Client", example="John Smith"),
    "Phone Number": fields.String(required=False, description="The Client's contact phone number", example="07123 456 789"),
    "Delivery Date": fields.String(required=True, description="The date that the food parcel should be delivered in the format of DD/MM/YYYY",
                                   example="23/04/2020"),
    "Addresss Line 1": fields.String(required=True, description="The first line of the address", example="8 Terrace Mews"),
    "Address Line 2": fields.String(required=False, description="The second line of the address", example="Portswood"),
    "Town": fields.String(required=False, description="The town of the address", example="Solihull"),
    "County": fields.String(required=False, description="The county of the address", example="London"),
    "Postcode": fields.String(required=True, description="The postcode of the address", example="SW9 1AF"),
    "Delivery Instructions": fields.String(required=False, description="Delivery instructions for the driver", example="Please buzz flat 1"),
    "Household Size": fields.String(required=True, description="The type of request", example="Single",
                                    enum=["Single", "Family of 2", "Family of 3", "Family of 4", "Family of 5", "Family of 6", "Family of 7",
                                          "Family of 8", "Family of 9+"]),
    "Number of Adults": fields.String(required=True, description="The number of individuals living at the household that are aged 16 or over",
                                       example="2"),
    "Number of Children": fields.String(required=False, description="The number of children living at the household", example="1"),
    "Age of Children": fields.String(required=True, description="The age range of the children living at the household", example="3-6"),
    "Dietary Requirements": fields.String(required=True, description="Whether the Client has any dietary requirements", example="No",
                                          enum=["Yes", "No", "Don't Know"]),
    "Feminine Products Required?": fields.String(required=True, description="Whether the Client requires feminine products", example="No",
                                                 enum=["Yes", "No", "Don't Know"]),
    "Baby Products Required?": fields.String(required=True, description="Whether the Client requires baby products", example="Don't Know",
                                             enum=["Yes", "No", "Don't Know"]),
    "Pet Food Required?": fields.String(required=True, description="Whether the Client requires pet food", example="Yes",
                                        enum=["Yes", "No", "Don't Know"]),
    "Extra Information": fields.String(required=False, description="Any extra information to be noted", example="No dairy")
})

page_of_requests = rest.inherit("A page of Client Requests", models.pagination, {
    "items": fields.List(fields.Nested(request))
})

distinct_request_values = rest.model("Distinct Client Request Values", {
    "Values": fields.List(fields.String(required=True, description="A distinct value of the requested attribute across the Requests data"))
})
