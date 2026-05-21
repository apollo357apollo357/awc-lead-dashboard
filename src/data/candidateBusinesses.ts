import type { CandidateBusiness } from '../types';

// Real public candidate businesses compiled from OpenStreetMap/Overpass records for the Edmonton, Nisku, Leduc, Spruce Grove, and Stony Plain operating area.
// These are seed records only: each row becomes its own profile, and the OSINT button turns the seed into a sourced AWC workflow-intelligence profile.
export const candidateBusinesses: CandidateBusiness[] = [
  {
    "id": "osm-seed-dent-force-paintless-dent-repair",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=DENT%20FORCE%20Paintless%20Dent%20Repair%20Edmonton%2C%20AB",
    "companyName": "DENT FORCE Paintless Dent Repair",
    "category": "car_repair",
    "location": "Edmonton, AB",
    "address": "17209 107 Avenue NW",
    "website": "https://dentforce.ca/dent-repair-edmonton/",
    "phone": "",
    "email": "edmonton@dentforce.ca",
    "lat": 53.5528145,
    "lon": -113.6184888,
    "publicTags": {
      "shop": "car_repair",
      "opening_hours": "Mo-Fr 08:00-17:00"
    }
  },
  {
    "id": "osm-seed-garage-door-repair-edmonton",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Garage%20Door%20Repair%20Edmonton%20Edmonton%2C%20AB",
    "companyName": "Garage Door Repair Edmonton",
    "category": "company",
    "location": "Edmonton, AB",
    "address": "5860 111 Street",
    "website": "https://www.garage-repairs-edmonton.ca/",
    "phone": "+1-780-851-2326",
    "email": "",
    "lat": 53.4960035,
    "lon": -113.5177604,
    "publicTags": {
      "office": "company"
    }
  },
  {
    "id": "osm-seed-go-asphalt-ltd",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Go%20Asphalt%20Ltd%20Edmonton%2C%20AB",
    "companyName": "Go Asphalt Ltd",
    "category": "company",
    "location": "Edmonton, AB",
    "address": "20150 118a Ave NW",
    "website": "https://www.goasphalt.ca",
    "phone": "+1-780-818-0070",
    "email": "info@goasphalt.ca",
    "lat": 53.5709114,
    "lon": -113.6704485,
    "publicTags": {
      "office": "company",
      "opening_hours": "Mo-Fr 08:30-16:30; Sa-Su closed"
    }
  },
  {
    "id": "osm-seed-jeno-s-auto",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Jeno%E2%80%99s%20Auto%20Edmonton%2C%20AB",
    "companyName": "Jeno’s Auto",
    "category": "car_repair",
    "location": "Edmonton, AB",
    "address": "11229 156 Street NW",
    "website": "https://www.jenosauto.com/",
    "phone": "+1 780-454-8486",
    "email": "jenosauto777@gmail.com",
    "lat": 53.5621735,
    "lon": -113.5901564,
    "publicTags": {
      "shop": "car_repair",
      "opening_hours": "Mo-Fr 09:00-18:00, Sa 09:00-15:00"
    }
  },
  {
    "id": "osm-seed-affinity-dental-kingsway",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Affinity%20Dental%20Kingsway%20Edmonton%2C%20AB",
    "companyName": "Affinity Dental Kingsway",
    "category": "dentist",
    "location": "Edmonton, AB",
    "address": "108 Kingsway NW",
    "website": "https://www.edmontondental.ca/",
    "phone": "+1 780-471-2102",
    "email": "reception@affinitydentalkingsway.ca",
    "lat": 53.5634059,
    "lon": -113.5055222,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist"
    }
  },
  {
    "id": "osm-seed-ammara-contractors-inc",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Ammara%20Contractors%20Inc.%20Edmonton%2C%20AB",
    "companyName": "Ammara Contractors Inc.",
    "category": "company",
    "location": "Edmonton, AB",
    "address": "14528 115A Avenue NW",
    "website": "http://www.ammaracontractors.com/",
    "phone": "+1-780-670-8875",
    "email": "sales@ammaracontractors.com",
    "lat": 53.5656591,
    "lon": -113.5723864,
    "publicTags": {
      "office": "company"
    }
  },
  {
    "id": "osm-seed-belle-rive-dental-clinic",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Belle%20Rive%20Dental%20Clinic%20Edmonton%2C%20AB",
    "companyName": "Belle Rive Dental Clinic",
    "category": "dentist",
    "location": "Edmonton, AB",
    "address": "8328 160 Ave NW",
    "website": "https://www.bellerivedental.ca/",
    "phone": "+1-780-473-4867",
    "email": "info@bellerivedental.ca",
    "lat": 53.6211008,
    "lon": -113.4695007,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist",
      "opening_hours": "Mo-We 09:00-19:00, Th 09:00-17:00, Fr-Sa 09:00-15:00"
    }
  },
  {
    "id": "osm-seed-burton-denture-clinic",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Burton%20Denture%20Clinic%20Edmonton%2C%20AB",
    "companyName": "Burton Denture Clinic",
    "category": "dentist",
    "location": "Edmonton, AB",
    "address": "11730 104 Ave NW",
    "website": "https://www.burtondentureclinic.ca",
    "phone": "+1-780-422-3235",
    "email": "",
    "lat": 53.5473462,
    "lon": -113.5248576,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist",
      "opening_hours": "Mo-Fr 09:00-16:00"
    }
  },
  {
    "id": "osm-seed-can-west-transmission-parts",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Can-West%20Transmission%20Parts%20Edmonton%2C%20AB",
    "companyName": "Can-West Transmission Parts",
    "category": "car_repair",
    "location": "Edmonton, AB",
    "address": "9174 Yellowhead Trail NW",
    "website": "https://canwesttransmissions.ca/",
    "phone": "+1-780-471-1534",
    "email": "",
    "lat": 53.5828671,
    "lon": -113.476708,
    "publicTags": {
      "shop": "car_repair"
    }
  },
  {
    "id": "osm-seed-ottewell-animal-clinic",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Ottewell%20Animal%20Clinic%20Edmonton%2C%20AB",
    "companyName": "Ottewell Animal Clinic",
    "category": "veterinary",
    "location": "Edmonton, AB",
    "address": "6142 90 Avenue North-west",
    "website": "https://ottewellanimalclinic.com/",
    "phone": "+1-780-466-1826",
    "email": "clinic.ottewell@shawbiz.ca",
    "lat": 53.5254896,
    "lon": -113.4269027,
    "publicTags": {
      "amenity": "veterinary",
      "opening_hours": "Mo 07:30-18:00, Tu 07:30-20:00, We-Fr 07:30-18:00; Sa 08:00-12:00"
    }
  },
  {
    "id": "osm-seed-ottewell-dental-clinic",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Ottewell%20Dental%20Clinic%20Edmonton%2C%20AB",
    "companyName": "Ottewell Dental Clinic",
    "category": "dentist",
    "location": "Edmonton, AB",
    "address": "6128 90 Avenue North-west",
    "website": "https://www.ottewelldental.com/",
    "phone": "+1-780-465-0505",
    "email": "ottewelldental@shaw.ca",
    "lat": 53.525361,
    "lon": -113.426574,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist"
    }
  },
  {
    "id": "osm-seed-bonnie-doon-medical-centre",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Bonnie%20Doon%20Medical%20Centre%20Edmonton%2C%20AB",
    "companyName": "Bonnie Doon Medical Centre",
    "category": "clinic",
    "location": "Edmonton, AB",
    "address": "8130 82 Ave NW",
    "website": "https://mdmedicalhealthcentres.com/",
    "phone": "+1-780-705-0707",
    "email": "",
    "lat": 53.5182418,
    "lon": -113.4543059,
    "publicTags": {
      "amenity": "clinic",
      "healthcare": "clinic"
    }
  },
  {
    "id": "osm-seed-certified-green-cleaning-inc",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Certified%20Green%20Cleaning%20Inc.%20Edmonton%2C%20AB",
    "companyName": "Certified Green Cleaning Inc.",
    "category": "cleaning",
    "location": "Edmonton, AB",
    "address": "4320 116 Street NW",
    "website": "https://certifiedgreencleaning.com/edmonton-janitorial/",
    "phone": "+1-587-841-5239",
    "email": "",
    "lat": 53.480924,
    "lon": -113.5326666,
    "publicTags": {
      "office": "company"
    }
  },
  {
    "id": "osm-seed-dx-medical-centres",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=DX%20Medical%20Centres%20Edmonton%2C%20AB",
    "companyName": "DX Medical Centres",
    "category": "clinic",
    "location": "Edmonton, AB",
    "address": "7629 38 Avenue NW",
    "website": "https://dxmedical.ca/",
    "phone": "+1 780 705 8400",
    "email": "",
    "lat": 53.4728967,
    "lon": -113.4509404,
    "publicTags": {
      "amenity": "clinic",
      "healthcare": "clinic"
    }
  },
  {
    "id": "osm-seed-dr-mark-bochinski-dental",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Dr.%20Mark%20Bochinski%20Dental%20Edmonton%2C%20AB",
    "companyName": "Dr. Mark Bochinski Dental",
    "category": "dentist",
    "location": "Edmonton, AB",
    "address": "10051 117 Street NW",
    "website": "https://markbochinskidental.ca/",
    "phone": "+1-780-482-6551",
    "email": "info@markbochinskidental.ca",
    "lat": 53.5402678,
    "lon": -113.522792,
    "publicTags": {
      "amenity": "dentist"
    }
  },
  {
    "id": "osm-seed-duty-cleaners",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Duty%20Cleaners%20Edmonton%2C%20AB",
    "companyName": "Duty Cleaners",
    "category": "cleaning",
    "location": "Edmonton, AB",
    "address": "18615 71 Avenue NW",
    "website": "https://dutycleaners.ca/",
    "phone": "+1-780-913-6565",
    "email": "info@dutycleaners.ca",
    "lat": 53.5043096,
    "lon": -113.643652,
    "publicTags": {
      "office": "cleaning"
    }
  },
  {
    "id": "osm-seed-ergo-design-studio-inc",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=ERGO%20Design%20Studio%20Inc.%20Edmonton%2C%20AB",
    "companyName": "ERGO Design Studio Inc.",
    "category": "company",
    "location": "Edmonton, AB",
    "address": "10883 Saskatchewan Drive NW",
    "website": "https://ergo-studio.com/",
    "phone": "+1-780-504-5758",
    "email": "",
    "lat": 53.5236169,
    "lon": -113.511578,
    "publicTags": {
      "office": "company"
    }
  },
  {
    "id": "osm-seed-ellerslie-medical-centre",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Ellerslie%20Medical%20centre%20Edmonton%2C%20AB",
    "companyName": "Ellerslie Medical centre",
    "category": "clinic",
    "location": "Edmonton, AB",
    "address": "11140 Ellerslie Rd SW",
    "website": "https://www.edmontonsouthsidepcn.ca/",
    "phone": "+1-780-391-1880",
    "email": "",
    "lat": 53.4263045,
    "lon": -113.518203,
    "publicTags": {
      "amenity": "clinic",
      "healthcare": "clinic"
    }
  },
  {
    "id": "osm-seed-glenwood-sport-spine",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Glenwood%20Sport%20%26%20Spine%20Edmonton%2C%20AB",
    "companyName": "Glenwood Sport & Spine",
    "category": "clinic",
    "location": "Edmonton, AB",
    "address": "16416 100 Ave NW",
    "website": "https://gsshealth.ca",
    "phone": "+1 780-487-6161",
    "email": "",
    "lat": 53.5397569,
    "lon": -113.605529,
    "publicTags": {
      "amenity": "clinic",
      "healthcare": "clinic"
    }
  },
  {
    "id": "osm-seed-gold-key-benefits-group",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Gold%20Key%20Benefits%20Group%20Edmonton%2C%20AB",
    "companyName": "Gold Key Benefits Group",
    "category": "insurance",
    "location": "Edmonton, AB",
    "address": "4732 91 Ave NW",
    "website": "https://www.goldkeybenefits.com/",
    "phone": "+1-877-277-0677",
    "email": "",
    "lat": 53.5252309,
    "lon": -113.4146487,
    "publicTags": {
      "office": "insurance"
    }
  },
  {
    "id": "osm-seed-hajduk-gibbs-llp",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Hajduk%20Gibbs%20LLP%20Edmonton%2C%20AB",
    "companyName": "Hajduk Gibbs LLP",
    "category": "lawyer",
    "location": "Edmonton, AB",
    "address": "10120 118 Street NW",
    "website": "https://hgllp.ca",
    "phone": "+1-780-428-4258",
    "email": "info@hajdukandgibbs.com",
    "lat": 53.5414195,
    "lon": -113.5255278,
    "publicTags": {
      "office": "lawyer"
    }
  },
  {
    "id": "osm-seed-interior-offroad-equipment-ltd",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Interior%20Offroad%20Equipment%20Ltd.%20Edmonton%2C%20AB",
    "companyName": "Interior Offroad Equipment Ltd.",
    "category": "company",
    "location": "Edmonton, AB",
    "address": "17210 103 Avenue NW",
    "website": "https://ior.ca/",
    "phone": "+1-780-451-0030",
    "email": "request-info@ior.ca",
    "lat": 53.5455265,
    "lon": -113.6182476,
    "publicTags": {
      "office": "company",
      "opening_hours": "Mo-Fr 08:00-17:00"
    }
  },
  {
    "id": "osm-seed-jamie-davis-towing",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Jamie%20Davis%20Towing%20Edmonton%2C%20AB",
    "companyName": "Jamie Davis Towing",
    "category": "car_repair",
    "location": "Edmonton, AB",
    "address": "11480 156 Street NW",
    "website": "https://www.jamiedavistowing.com/",
    "phone": "",
    "email": "info@jamiedavistowing.com",
    "lat": 53.5653788,
    "lon": -113.5910136,
    "publicTags": {
      "shop": "car_repair"
    }
  },
  {
    "id": "osm-seed-jayson-global-roofing",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Jayson%20Global%20Roofing%20Edmonton%2C%20AB",
    "companyName": "Jayson Global Roofing",
    "category": "roofer",
    "location": "Edmonton, AB",
    "address": "8925 62 Avenue NW",
    "website": "https://www.jaysonglobal.com",
    "phone": "+1-780-438-0331",
    "email": "info@jaysonglobal.com",
    "lat": 53.4981432,
    "lon": -113.4644065,
    "publicTags": {
      "craft": "roofer",
      "opening_hours": "Mo-Fr 08:00-16:30; Sa,Su off"
    }
  },
  {
    "id": "osm-seed-kodiak-carpet-care",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Kodiak%20Carpet%20Care%20Edmonton%2C%20AB",
    "companyName": "Kodiak Carpet Care",
    "category": "cleaning",
    "location": "Edmonton, AB",
    "address": "11821 145 St NW",
    "website": "https://kodiakcarpetcare.ca",
    "phone": "+1 780-459-5154",
    "email": "",
    "lat": 53.5710153,
    "lon": -113.570749,
    "publicTags": {
      "craft": "cleaning"
    }
  },
  {
    "id": "osm-seed-millbourne-mall-medical-centre",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Millbourne%20Mall%20Medical%20Centre%20Edmonton%2C%20AB",
    "companyName": "Millbourne Mall Medical Centre",
    "category": "clinic",
    "location": "Edmonton, AB",
    "address": "38 Avenue NW",
    "website": "https://www.millbournemedicalcentre.ca/",
    "phone": "+1 587 521 2022",
    "email": "info@millbournemedicalcentre.ca",
    "lat": 53.4715969,
    "lon": -113.4510706,
    "publicTags": {
      "amenity": "clinic",
      "healthcare": "clinic"
    }
  },
  {
    "id": "osm-seed-millcreek-dental-care",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Millcreek%20Dental%20Care%20Edmonton%2C%20AB",
    "companyName": "Millcreek Dental Care",
    "category": "dentist",
    "location": "Edmonton, AB",
    "address": "9149 82 Ave NW",
    "website": "https://www.millcreekdental.ca",
    "phone": "+1-780-463-9522",
    "email": "milldental@mail.com",
    "lat": 53.5176214,
    "lon": -113.4698077,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist"
    }
  },
  {
    "id": "osm-seed-paladin-technologies",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Paladin%20Technologies%20Edmonton%2C%20AB",
    "companyName": "Paladin Technologies",
    "category": "security",
    "location": "Edmonton, AB",
    "address": "4103 97 Street NW",
    "website": "https://www.paladintechnologies.com/",
    "phone": "+1-780-434-7564",
    "email": "",
    "lat": 53.4767513,
    "lon": -113.4789501,
    "publicTags": {
      "office": "security"
    }
  },
  {
    "id": "osm-seed-revtech-international-inc",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Revtech%20International%20Inc.%20Edmonton%2C%20AB",
    "companyName": "Revtech International Inc.",
    "category": "company",
    "location": "Edmonton, AB",
    "address": "10755 180 Street NW",
    "website": "https://www.revtechinter.com",
    "phone": "+1-780-496-9158",
    "email": "",
    "lat": 53.5545339,
    "lon": -113.6279377,
    "publicTags": {
      "office": "company"
    }
  },
  {
    "id": "osm-seed-sadler-insurance-inc",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Sadler%20Insurance%20Inc.%20Edmonton%2C%20AB",
    "companyName": "Sadler Insurance Inc.",
    "category": "insurance",
    "location": "Edmonton, AB",
    "address": "10808 82 Avenue NW",
    "website": "https://www.sadlerin.com/",
    "phone": "+1-780-433-4426",
    "email": "shambly@sadlerin.com",
    "lat": 53.5183085,
    "lon": -113.5099183,
    "publicTags": {
      "office": "insurance"
    }
  },
  {
    "id": "osm-seed-sharshar-dental-group",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Sharshar%20Dental%20Group%20Edmonton%2C%20AB",
    "companyName": "Sharshar Dental Group",
    "category": "dentist",
    "location": "Edmonton, AB",
    "address": "7629 38 Avenue NW",
    "website": "https://sharshardental.com/",
    "phone": "+1 780 757 9999",
    "email": "south@sharshardental.com",
    "lat": 53.4725356,
    "lon": -113.4498081,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist"
    }
  },
  {
    "id": "osm-seed-devon-dental-associates",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Devon%20Dental%20Associates%20Leduc%2C%20AB",
    "companyName": "Devon Dental Associates",
    "category": "dentist",
    "location": "Leduc, AB",
    "address": "180 Miquelon Ave",
    "website": "https://www.devondentist.ca/",
    "phone": "+1 780-987-2833",
    "email": "devondentist@shaw.ca",
    "lat": 53.3542392,
    "lon": -113.7314045,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist"
    }
  },
  {
    "id": "osm-seed-flair-airlines",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Flair%20Airlines%20Nisku%2C%20AB",
    "companyName": "Flair Airlines",
    "category": "company",
    "location": "Nisku, AB",
    "address": "4032-1000 Airport Road",
    "website": "https://www.flyflair.com",
    "phone": "+1-833-711-2333",
    "email": "",
    "lat": 53.3085134,
    "lon": -113.5847266,
    "publicTags": {
      "office": "company",
      "opening_hours": "24/7"
    }
  },
  {
    "id": "osm-seed-progress-glass-ltd",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Progress%20Glass%20Ltd.%20Spruce%20Grove%2C%20AB",
    "companyName": "Progress Glass Ltd.",
    "category": "car_repair",
    "location": "Spruce Grove, AB",
    "address": "5 Alberta Avenue",
    "website": "https://www.progressglass.ca",
    "phone": "+1 780 962 5353",
    "email": "",
    "lat": 53.5376126,
    "lon": -113.9107862,
    "publicTags": {
      "shop": "car_repair"
    }
  },
  {
    "id": "osm-seed-ryfan-industrial-electric",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Ryfan%20Industrial%20Electric%20Spruce%20Grove%2C%20AB",
    "companyName": "Ryfan Industrial Electric",
    "category": "electrician",
    "location": "Spruce Grove, AB",
    "address": "485 South Avenue",
    "website": "https://www.ryfan.ca",
    "phone": "+1 780 571 8000",
    "email": "",
    "lat": 53.5395002,
    "lon": -113.8873709,
    "publicTags": {
      "craft": "electrician",
      "opening_hours": "Mo-Fr 07:30-16:00"
    }
  },
  {
    "id": "osm-seed-back-on-track-chiropractic",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Back%20on%20Track%20Chiropractic%20Spruce%20Grove%2C%20AB",
    "companyName": "Back on Track Chiropractic",
    "category": "clinic",
    "location": "Spruce Grove, AB",
    "address": "101 1st Avenue",
    "website": "http://backontrackchiropractic.com",
    "phone": "+1 780 962 2423",
    "email": "",
    "lat": 53.5416113,
    "lon": -113.9092158,
    "publicTags": {
      "amenity": "clinic",
      "healthcare": "alternative"
    }
  },
  {
    "id": "osm-seed-bedard-lee-associates",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Bedard%20Lee%20%26%20Associates%20Spruce%20Grove%2C%20AB",
    "companyName": "Bedard Lee & Associates",
    "category": "accountant",
    "location": "Spruce Grove, AB",
    "address": "115 Main Street",
    "website": "https://bedardlee.com/",
    "phone": "+1 587 405 1250",
    "email": "",
    "lat": 53.5420738,
    "lon": -113.9030381,
    "publicTags": {
      "office": "accountant"
    }
  },
  {
    "id": "osm-seed-evergreen-family-dentistry",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Evergreen%20Family%20Dentistry%20Spruce%20Grove%2C%20AB",
    "companyName": "Evergreen Family Dentistry",
    "category": "dentist",
    "location": "Spruce Grove, AB",
    "address": "115 McLeod Avenue",
    "website": "https://evergreenfamilydentistry.ca/",
    "phone": "+1 780-962-9191",
    "email": "",
    "lat": 53.5424862,
    "lon": -113.9078298,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist"
    }
  },
  {
    "id": "osm-seed-grove-dental",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Grove%20Dental%20Spruce%20Grove%2C%20AB",
    "companyName": "Grove Dental",
    "category": "dentist",
    "location": "Spruce Grove, AB",
    "address": "636 King Street",
    "website": "https://grovedental.ca/",
    "phone": "+1 780 962 4226",
    "email": "",
    "lat": 53.5574504,
    "lon": -113.8947934,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist"
    }
  },
  {
    "id": "osm-seed-hub-legal",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Hub%20Legal%20Spruce%20Grove%2C%20AB",
    "companyName": "Hub Legal",
    "category": "lawyer",
    "location": "Spruce Grove, AB",
    "address": "636 King Street",
    "website": "https://www.hublegal.ca/",
    "phone": "+1 780 571 3111",
    "email": "",
    "lat": 53.5574691,
    "lon": -113.8942552,
    "publicTags": {
      "office": "lawyer"
    }
  },
  {
    "id": "osm-seed-queen-street-dental",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Queen%20Street%20Dental%20Spruce%20Grove%2C%20AB",
    "companyName": "Queen Street Dental",
    "category": "dentist",
    "location": "Spruce Grove, AB",
    "address": "505 Queen St",
    "website": "https://www.sprucegrovedentist.ca/",
    "phone": "+1 780 960-1422",
    "email": "queenstreetdental@gmail.com",
    "lat": 53.5446718,
    "lon": -113.9073129,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist"
    }
  },
  {
    "id": "osm-seed-lifemark-physiotherapy",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=LifeMark%20Physiotherapy%20Stony%20Plain%2C%20AB",
    "companyName": "LifeMark Physiotherapy",
    "category": "physiotherapist",
    "location": "Stony Plain, AB",
    "address": "4300 South Park Drive",
    "website": "https://lifemarkhealthgroup.ca",
    "phone": "+1 780 963 5118",
    "email": "",
    "lat": 53.5387141,
    "lon": -113.9812852,
    "publicTags": {
      "amenity": "clinic",
      "healthcare": "physiotherapist"
    }
  },
  {
    "id": "osm-seed-meridian-veterinary-clinic",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Meridian%20Veterinary%20Clinic%20Stony%20Plain%2C%20AB",
    "companyName": "Meridian Veterinary Clinic",
    "category": "veterinary",
    "location": "Stony Plain, AB",
    "address": "4707 49 Avenue",
    "website": "https://meridianvet.ca/",
    "phone": "+1 780 968 0700",
    "email": "",
    "lat": 53.5318356,
    "lon": -114.0014389,
    "publicTags": {
      "amenity": "veterinary"
    }
  },
  {
    "id": "osm-seed-stony-plain-denture-clinic",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Stony%20Plain%20Denture%20Clinic%20Stony%20Plain%2C%20AB",
    "companyName": "Stony Plain Denture Clinic",
    "category": "dentist",
    "location": "Stony Plain, AB",
    "address": "4707 49 Avenue",
    "website": "https://stonyplaindentureclinic.com/",
    "phone": "+1 780 963 2426",
    "email": "",
    "lat": 53.5318472,
    "lon": -114.0013048,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist"
    }
  },
  {
    "id": "osm-seed-yellowhead-veterinary-clinic",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Yellowhead%20Veterinary%20Clinic%20Stony%20Plain%2C%20AB",
    "companyName": "Yellowhead Veterinary Clinic",
    "category": "veterinary",
    "location": "Stony Plain, AB",
    "address": "4305 South Park Drive",
    "website": "https://www.yellowheadvet.com/",
    "phone": "+1-780-963-4885",
    "email": "",
    "lat": 53.5390108,
    "lon": -113.9781899,
    "publicTags": {
      "amenity": "veterinary"
    }
  },
  {
    "id": "osm-seed-access-insurance-group",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Access%20Insurance%20Group%20Stony%20Plain%2C%20AB",
    "companyName": "Access Insurance Group",
    "category": "insurance",
    "location": "Stony Plain, AB",
    "address": "5101 48 Street",
    "website": "https://www.accessinsurancegroup.com/",
    "phone": "+1 780 963 2554",
    "email": "",
    "lat": 53.5286965,
    "lon": -114.0013866,
    "publicTags": {
      "office": "insurance"
    }
  },
  {
    "id": "osm-seed-birdsell-grant-llp",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Birdsell%20Grant%20LLP%20Stony%20Plain%2C%20AB",
    "companyName": "Birdsell Grant LLP",
    "category": "lawyer",
    "location": "Stony Plain, AB",
    "address": "5300 50 Street",
    "website": "https://birdsell.ca/",
    "phone": "+1 780 963 8181",
    "email": "",
    "lat": 53.5265608,
    "lon": -114.0069991,
    "publicTags": {
      "office": "lawyer"
    }
  },
  {
    "id": "osm-seed-darson-insurance-services",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Darson%20Insurance%20Services%20Stony%20Plain%2C%20AB",
    "companyName": "Darson Insurance Services",
    "category": "insurance",
    "location": "Stony Plain, AB",
    "address": "4911 50 Street",
    "website": "https://www.darsonins.com",
    "phone": "+1 780 968 7037",
    "email": "",
    "lat": 53.5304534,
    "lon": -114.0068556,
    "publicTags": {
      "office": "insurance"
    }
  },
  {
    "id": "osm-seed-dentistry-by-dekterov",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Dentistry%20by%20Dekterov%20Stony%20Plain%2C%20AB",
    "companyName": "Dentistry by Dekterov",
    "category": "dentist",
    "location": "Stony Plain, AB",
    "address": "4305 South Park Drive",
    "website": "http://www.dentistrybydekterov.com",
    "phone": "+1-780-963-4885",
    "email": "",
    "lat": 53.5390072,
    "lon": -113.9780459,
    "publicTags": {
      "amenity": "dentist",
      "healthcare": "dentist"
    }
  },
  {
    "id": "osm-seed-hawkings-tinney-llp",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Hawkings%20Tinney%20LLP%20Stony%20Plain%2C%20AB",
    "companyName": "Hawkings Tinney LLP",
    "category": "accountant",
    "location": "Stony Plain, AB",
    "address": "5300 50 Street",
    "website": "https://hawkings.com/",
    "phone": "+1 780 963 2727",
    "email": "",
    "lat": 53.5266509,
    "lon": -114.0070286,
    "publicTags": {
      "office": "accountant"
    }
  },
  {
    "id": "osm-seed-signfab",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Signfab%20Stony%20Plain%2C%20AB",
    "companyName": "Signfab",
    "category": "signmaker",
    "location": "Stony Plain, AB",
    "address": "20-35 Boulder Boulevard",
    "website": "http://signfab.ca",
    "phone": "+1-780-963-9090",
    "email": "",
    "lat": 53.5425811,
    "lon": -113.9887365,
    "publicTags": {
      "craft": "signmaker"
    }
  },
  {
    "id": "osm-seed-belvedere-roofing",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Belvedere%20Roofing%20Spruce%20Grove%2C%20AB",
    "companyName": "Belvedere Roofing",
    "category": "roofer",
    "location": "Spruce Grove, AB",
    "address": "27445 100 Avenue",
    "website": "https://www.belvedereroofing.com",
    "phone": "+1 780-466-2118",
    "email": "",
    "lat": 53.5400113,
    "lon": -113.781451,
    "publicTags": {
      "craft": "roofer"
    }
  },
  {
    "id": "osm-seed-silverline-roofing",
    "source": "OpenStreetMap",
    "sourceUrl": "https://www.openstreetmap.org/search?query=Silverline%20Roofing%20Spruce%20Grove%2C%20AB",
    "companyName": "Silverline Roofing",
    "category": "roofer",
    "location": "Spruce Grove, AB",
    "address": "11441 261 Street",
    "website": "https://www.silverlineroofing.ca",
    "phone": "+1 587 754 9495",
    "email": "",
    "lat": 53.5636366,
    "lon": -113.7589624,
    "publicTags": {
      "craft": "roofer"
    }
  }
];
