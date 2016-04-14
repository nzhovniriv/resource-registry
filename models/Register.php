<?php

namespace app\models;
use Yii;

class Register extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'register';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'owner_data', 'year'], 'required'],
            [['owner_data'], 'string'],
            [['year'], 'integer'],
            [['name'], 'string', 'max' => 255],
            [['owner_name'], 'string', 'max' => 100]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'owner_data' => 'Owner_data',
            'owner_name' => 'Owner_name',
            'year' => 'Year',
        ];
    }
}