from sqlalchemy import create_engine, text

# 1. Connect to your Postgres database
# Replace placeholders with your DB credentials
engine = create_engine("postgresql://neondb_owner:npg_luKPJEIx8jO6@ep-morning-resonance-adobddox-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

# 2. Define a query
query = text("""
    SELECT 
        user_name as name, user_role as role, story_titles as program_tile,story_contents as program_content, 
        user_hotspot_locations as location, user_hotspot_names as region, user_hotspot_descriptions as news, 
        watertest_notes as water_test_note, water_qualities as water_quality, waterbody_names as water_body_name, has_global_alert as global_alert, recent_reports as recent_report
    FROM rag_data_view
    WHERE user_id = :uid
""")

# 3. Execute and fetch results
with engine.connect() as conn:
    result = conn.execute(query, {"uid": '4287d96a-b664-4413-b183-8ad335e9fe22'})  # example: user_id=1
    rows = result.mappings().all()  # returns list of dict-like rows

print(rows)